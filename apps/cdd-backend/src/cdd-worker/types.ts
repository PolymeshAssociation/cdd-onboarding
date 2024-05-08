import { CddProvider } from '@cdd-onboarding/cdd-types';
import { JumioCallbackDto } from '../jumio/types';
import { MockCddDto } from '../mock-cdd/types';
import { NetkiBusinessCallbackDto, NetkiCallbackDto } from '../netki/types';

export type CddJob = JumioCddJob | NetkiCddJob | NetkiBusinessJob | MockCddJob;

export interface JumioCddJob {
  value: JumioCallbackDto;
  type: 'jumio';
}

export interface NetkiCddJob {
  value: NetkiCallbackDto;
  type: 'netki';
}

export interface NetkiBusinessJob {
  value: NetkiBusinessCallbackDto;
  type: 'netki-kyb';
}

export interface MockCddJob {
  value: MockCddDto;
  type: 'mock';
}

export interface JobIdentifier {
  id: string;
  provider: CddProvider;
}
