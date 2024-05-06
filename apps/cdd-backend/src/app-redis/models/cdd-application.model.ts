import { CddProvider } from '@cdd-onboarding/cdd-types';

export interface CddApplicationModel {
  id: string;
  address: string;
  url: string;
  provider: CddProvider;
  timestamp: string;
  externalId: string;
  isBusiness?: boolean;
}
