import { HealthCheckResponse } from '@cdd-onboarding/cdd-types';
import { Injectable } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { JumioService } from '../jumio/jumio.service';
import { MailchimpService } from '../mailchimp/mailchimp.service';
import { NetkiService } from '../netki/netki.service';
import { PolymeshNetworkResponse } from './types';

@Injectable()
export class InfoService {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly netki: NetkiService,
    private readonly jumio: JumioService,
    private readonly redis: Redis,
    private readonly mailchimp: MailchimpService
  ) {}

  public async all(): Promise<HealthCheckResponse> {
    const [network, jumio, netki, redis, mailchimp] = await Promise.all([
      this.polymeshInfo(),
      this.jumioInfo(),
      this.netkiInfo(),
      this.redisInfo(),
      this.mailchimpInfo(),
    ]);

    const data = {
      network,
      jumio,
      netki,
      redis,
      mailchimp
    };

    const healthy = !Object.values(data).some((response) => !response.healthy);

    return new HealthCheckResponse(healthy, data);
  }

  public async polymeshInfo(): Promise<
    HealthCheckResponse<PolymeshNetworkResponse>
  > {
    let healthy = true;

    const ss58Format = this.polymesh.network.getSs58Format();
    const [networkProperties, latestBlock] = await Promise.all([
      this.polymesh.network.getNetworkProperties(),
      this.polymesh.network.getLatestBlock(),
    ]).catch(() => {
      healthy = false;

      return [];
    });

    const data = new PolymeshNetworkResponse(
      ss58Format,
      latestBlock,
      networkProperties
    );

    return new HealthCheckResponse(healthy, data);
  }

  public async jumioInfo(): Promise<HealthCheckResponse> {
    let healthy = true;

    await this.jumio
      .generateLink(randomUUID(), Buffer.from('HEALTH-PING').toString('base64'))
      .catch(() => {
        healthy = false;
      });

    return new HealthCheckResponse(healthy);
  }

  public async redisInfo(): Promise<HealthCheckResponse> {
    let healthy = true;

    await this.redis.ping().catch(() => {
      healthy = false;
    });

    return new HealthCheckResponse(healthy);
  }

  public async netkiInfo(): Promise<HealthCheckResponse> {
    let healthy = true;

    await this.netki.getBusinessInfo().catch(() => {
      healthy = false;
    });

    return new HealthCheckResponse(healthy);
  }

  public async mailchimpInfo(): Promise<HealthCheckResponse> {
    const healthy = await this.mailchimp.ping();

    return new HealthCheckResponse(healthy);
  }
}
