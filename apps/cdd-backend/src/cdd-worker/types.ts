import { CddProvider } from '@cdd-onboarding/cdd-types';
import { JumioCallbackDto } from '../jumio/types';
import { MockCddDto } from '../mock-cdd/types';
import { NetkiCallbackDto } from '../netki/types';

export type CddJob = JumioCddJob | NetkiCddJob | MockCddJob;

export interface JumioCddJob {
  value: JumioCallbackDto;
  type: 'jumio';
}

export interface NetkiCddJob {
  value: NetkiCallbackDto;
  type: 'netki';
}

export interface MockCddJob {
  value: MockCddDto;
  type: 'mock';
}

export interface JobIdentifier {
  id: string;
  provider: CddProvider;
}
