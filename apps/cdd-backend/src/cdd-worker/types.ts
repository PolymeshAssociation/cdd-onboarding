import { CddProvider } from '@cdd-onboarding/cdd-types';
import { JumioCallbackDto } from '../jumio/types';
import { NetkiCallbackDto } from '../netki/types';

export interface CddApplication {
  id: string;
  address: string;
  url: string;
  provider: CddProvider;
  timestamp: string;
  externalId: string;
}

export type CddJob = JumioCddJob | NetkiCddJob;

export interface JumioCddJob {
  value: JumioCallbackDto;
  type: 'jumio';
}

export interface NetkiCddJob {
  value: NetkiCallbackDto;
  type: 'netki';
}

export interface JobIdentifier {
  id: string;
  provider: CddProvider;
}
