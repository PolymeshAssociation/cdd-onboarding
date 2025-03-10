import { CddProvider } from '@cdd-onboarding/cdd-types';
import { FinclusiveCddValue } from '../finclusive/types';
import { JumioCallbackDto } from '../jumio/types';
import { MockCddDto } from '../mock-cdd/types';
import { NetkiBusinessCallbackDto, NetkiCallbackDto } from '../netki/types';

export type CddJob =
  | JumioCddJob
  | NetkiCddJob
  | NetkiBusinessJob
  | MockCddJob
  | FinclusiveCddJob
  | FinclusiveBusinessCddJob;

export enum ProviderEnum {
  JUMIO = 'jumio',
  NETKI = 'netki',
  FINCLUSIVE = 'finclusive',
  FINCLUSIVE_BUSINESS = 'finclusive-kyb',
  MOCK = 'mock',
  NETKI_BUSINESS = 'netki-kyb',
}

type BaseCddJob<T extends ProviderEnum> = {
  type: T;
};

export interface JumioCddJob extends BaseCddJob<ProviderEnum.JUMIO> {
  value: JumioCallbackDto;
}

export interface NetkiCddJob extends BaseCddJob<ProviderEnum.NETKI> {
  value: NetkiCallbackDto;
}

export interface NetkiBusinessJob
  extends BaseCddJob<ProviderEnum.NETKI_BUSINESS> {
  value: NetkiBusinessCallbackDto;
}

export interface MockCddJob extends BaseCddJob<ProviderEnum.MOCK> {
  value: MockCddDto;
}

export interface FinclusiveCddJob extends BaseCddJob<ProviderEnum.FINCLUSIVE> {
  value: FinclusiveCddValue;
}

export interface FinclusiveBusinessCddJob
  extends BaseCddJob<ProviderEnum.FINCLUSIVE_BUSINESS> {
  value: FinclusiveCddValue;
}

export interface JobIdentifier {
  id: string;
  provider: CddProvider;
}
