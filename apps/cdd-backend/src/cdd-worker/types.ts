import { JumioCallbackDto } from '../jumio/types';

export interface CddApplication {
  id: string;
  address: string;
  link: string;
  provider: CddProvider;
  timestamp: Date;
  externalReference: string;
}

export interface CddJob {
  address: string;
  externalId: string;
  jumio: JumioCallbackDto;
}

export type CddProvider = 'jumio' | 'netki';
