import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AppRedisService } from '../app-redis/app-redis.service';
import { NetkiCallbackDto } from '../netki/types';
import { AddressBookService } from '../polymesh/address-book.service';
import {
  CddJob,
  MockCddJob,
  JobIdentifier,
  JumioCddJob,
  NetkiCddJob,
  NetkiBusinessJob,
} from './types';
import { Identity } from '@polymeshassociation/polymesh-sdk/types';
import { NetkiBusinessApplicationModel } from '../app-redis/models/netki-business-application.model';

@Processor()
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly signerLookup: AddressBookService,
    private readonly redis: AppRedisService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Process()
  async generateCdd(job: Job<CddJob>) {
    this.logger.info('received CDD job from queue', { jobId: job.id });

    if (job.data.type === 'jumio') {
      await this.handleJumio(job.data);
    } else if (job.data.type === 'netki') {
      await this.handleNetki(job.data);
    } else if (job.data.type === 'mock') {
      await this.handleMockJob(job.data);
    } else if (job.data.type === 'netki-kyb') {
      await this.handleNetkiBusiness(job.data);
    } else {
      throw new Error('unknown CDD job type encountered');
    }

    this.logger.info('finished processing CDD job', { jobId: job.id });
  }

  private async handleNetkiBusiness({
    value: {
      business: { parent_business: businessId, status },
    },
  }: NetkiBusinessJob): Promise<void> {
    if (status !== 'accepted') {
      this.logger.info(
        'netki business callback did not have accepted status. No action will be taken'
      );

      return;
    }

    const address = await this.redis.getNetkiBusinessAddress(businessId);

    if (!address) {
      this.logger.info(
        'there was no address associated to the business ID - no action will be taken',
        {
          businessId,
        }
      );

      return;
    }

    await this.createCddClaim(
      { id: businessId, provider: 'netki' },
      address,
      'netki'
    );
  }

  private async handleNetki({ value: netki }: NetkiCddJob): Promise<void> {
    const {
      identity: {
        transaction_identity: {
          client_guid: guid,
          identity_access_code: { business },
        },
        state,
      },
    } = netki;
    const id = guid.toLowerCase(); // netki codes are supposed to be lower case + digits. Sometimes clients cause them to be capitalized though
    const jobId: JobIdentifier = { id, provider: 'netki' };

    this.logger.info('starting netki job', { jobId, state });

    const [individualAddress, businessApplication] = await Promise.all([
      this.redis.getNetkiAddress(id),
      this.redis.getNetkiBusinessApplication(id),
    ]);

    if (!individualAddress && !businessApplication) {
      throw new Error('no information associated to netki code');
    }

    this.logger.info('netki job info retrieved', {
      jobId,
      address: individualAddress,
      state,
    });

    if (state === 'restarted') {
      this.logger.debug('handling netki restart', { jobId });
      if (individualAddress) {
        await this.handleNetkiRestart(jobId, individualAddress, netki);
      } else if (businessApplication) {
        await this.handleNetkiRestartForBusiness(
          jobId,
          businessApplication,
          netki
        );
      }
    } else if (state === 'completed') {
      this.logger.debug('handling netki completed', { jobId });
      if (individualAddress) {
        await this.createCddClaim(jobId, individualAddress, 'netki');
        await this.clearAddressApplications(jobId, individualAddress);
      } else if (businessApplication?.address) {
        if (!business) {
          this.logger.error(
            'no business ID was in callback for business application',
            { jobId, address: businessApplication.address }
          );

          throw new Error(
            'No business ID was in callback, but it was expected'
          );
        }

        await this.redis.setBusinessIdToAddress(
          business,
          businessApplication.address
        );
      } else {
        this.logger.info(
          'no address was associated to netki business application, no business ID association will be made'
        );
      }
    } else {
      this.logger.info('netki state did not have a handler - no action taken', {
        jobId,
        address: individualAddress,
        businessApplicationId: businessApplication?.id,
        state,
      });
    }

    this.logger.info('netki CDD job completed successfully', {
      jobId: jobId,
    });
  }

  private async handleNetkiRestart(
    jobId: JobIdentifier,
    address: string,
    netki: NetkiCallbackDto
  ): Promise<void> {
    const {
      identity: {
        transaction_identity: {
          identity_access_code: { child_codes: childCodes },
        },
      },
    } = netki;

    const childCode = childCodes[0];

    if (!childCode) {
      throw new Error(
        'property `child_codes` was not found in restart webhook payload'
      );
    }

    this.logger.debug('allocating restart access code', {
      jobId,
      address,
      childCode,
    });

    await this.redis.setNetkiCodeToAddress(childCode.code, address);
  }

  private async handleNetkiRestartForBusiness(
    jobId: JobIdentifier,
    application: NetkiBusinessApplicationModel,
    netki: NetkiCallbackDto
  ): Promise<void> {
    const {
      identity: {
        transaction_identity: {
          identity_access_code: { child_codes: childCodes },
        },
      },
    } = netki;

    const childCode = childCodes[0];

    if (!childCode) {
      throw new Error(
        'property `child_codes` was not found in restart webhook payload'
      );
    }

    this.logger.debug('allocating restart access code', {
      jobId,
      applicationId: application.id,
      childCode,
    });

    await this.redis.setNetkiCodeToBusiness(childCode.code, application);
  }

  private async handleJumio({ value: jumio }: JumioCddJob): Promise<void> {
    const {
      customerId: address,
      jumioIdScanReference: id,
      verificationStatus: status,
    } = jumio;
    const jobId: JobIdentifier = { id, provider: 'jumio' };

    this.logger.info('starting jumio job', { jobId, status });

    if (status === 'APPROVED_VERIFIED') {
      this.logger.debug('handling jumio approved verified', { jobId });
      await this.createCddClaim(jobId, address, 'jumio');

      await this.clearAddressApplications(jobId, address);
    } else {
      this.logger.info(
        'jumio verification status did not have a handler set - no action taken',
        { jobId, status: jumio.verificationStatus }
      );
    }
  }

  private async handleMockJob(info: MockCddJob): Promise<void> {
    const {
      value: { address, id },
    } = info;

    const jobId = { id, provider: 'mock' } as const;

    this.logger.info('starting mock job', { jobId, id });

    const { name } = await this.polymesh.network.getNetworkProperties();

    if (address.startsWith('2')) {
      throw new Error(
        'Cannot create mock CDD claim for address starting with "2"'
      );
    }

    if (name === 'mainnet') {
      throw new Error('Cannot process mock CDD jobs on mainnet');
    }

    await this.createCddClaim(jobId, address, 'mock');

    await this.clearAddressApplications(jobId, address);
  }

  private async clearAddressApplications(
    jobId: JobIdentifier,
    address: string
  ): Promise<number | void> {
    this.logger.info('clearing CDD application records', { jobId, address });

    return this.redis.clearApplications(address).catch((error) => {
      this.logger.error('problem clearing address CDD applications', {
        jobId,
        address,
        error,
      });
      // Swallow the error. The job was processed and shouldn't be retried
    });
  }

  private async createCddClaim(
    jobId: JobIdentifier,
    address: string,
    signer: 'jumio' | 'netki' | 'mock'
  ): Promise<void> {
    this.logger.info('attempting CDD creation', { jobId, address });

    const signingAccount = this.signerLookup.findAddress(signer);

    /**
     * If there is an error, but they already have a CDD then the job can be marked as complete.
     * It is expected to happen when user's try with multiple providers
     *
     * @note at the time of writing the SDK prepare check does not check for this condition.
     * If it does throw a prepare error then this handler should be adopted for it to keep the
     * error queue clean.
     */
    const existingCddRecovery = async (error: Error): Promise<Identity> => {
      const account = await this.polymesh.accountManagement.getAccount({
        address,
      });

      const identity = await account.getIdentity();
      if (identity) {
        this.logger.warn(
          'Swallowing error. A CDD claim was already made for the address',
          {
            jobId,
            address,
            error,
          }
        );

        return identity;
      }

      throw error;
    };

    const registerIdentityTx = await this.polymesh.identities.registerIdentity(
      {
        targetAccount: address,
        createCdd: true,
      },
      {
        signingAccount,
      }
    );

    const createdIdentity = await registerIdentityTx
      .run()
      .catch(async (error) => existingCddRecovery(error));

    this.logger.info('created CDD claim', {
      jobId,
      address,
      did: createdIdentity.did,
    });
  }
}
