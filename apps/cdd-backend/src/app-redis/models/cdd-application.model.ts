import { BusinessCddProvider, CddProvider } from '@cdd-onboarding/cdd-types';

export interface CddApplicationModel {
  id: string;
  address: string;
  url: string;
  provider: CddProvider | BusinessCddProvider;
  timestamp: string;
  externalId: string;
}
