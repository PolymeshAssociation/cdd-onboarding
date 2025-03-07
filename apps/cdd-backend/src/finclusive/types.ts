import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export enum FinclusiveAccessCodeTypeEnum {
  INDIVIDUAL = 1,
  ENTITY = 2,
  BOTH = 3,
}

export interface FinclusiveAccessCode {
  value: string;
  type: number;
  expiresAt: string;
  isMultipleUse: boolean;
  description: string;
  timesUsed: number;
}

export interface FinclusiveFetchCodesResponse {
  added: number;
  total: number;
}

type FinclusivePaginatedResponse<T> = {
  results: T[];
  currentPage: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  firstRowOnPage: number;
  lastRowOnPage: number;
};

export interface FinclusiveEntityInfo {
  finClusiveId: string;
  active: boolean;
  name: string;
  clientType: number;
  complianceStatus: number;
  bankingEligibilityStatus: number;
}

export type FinclusiveEntityInfoPageResponse =
  FinclusivePaginatedResponse<FinclusiveEntityInfo>;

const FinclusiveCallbackZ = extendApi(
  z.object({
    ApplicantID: z.string(),
    FinClusiveID: z.string(),
    NewStatus: z.number(),
    PossibleStatuses: z.array(z.string()),
  })
);

export class FinclusiveCallbackDto extends createZodDto(FinclusiveCallbackZ) {}

export interface FinclusiveCddValue extends FinclusiveCallbackDto {
  notificationType: string;
  address: string;
  name: string;
}

export interface FinclusiveCustomAttribute {
  name: string;
  value: string;
  orderIndex: number | null;
}

export interface FinclusiveAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface FinclusiveIndividualClientDetails
  extends Record<string, unknown> {
  finClusiveId: string;
  individualId: string;
  firstName: string;
  lastName: string;
  address: FinclusiveAddress;
  customAttributes: FinclusiveCustomAttribute[];
}

export interface FinclusiveEntityClientDetails extends Record<string, unknown> {
  finClusiveId: string;
  entityId: string;
  legalName: string;
  companyAddress: FinclusiveAddress;
  customAttributes: FinclusiveCustomAttribute[];
}

export interface FinclusiveClientDetails {
  individual: FinclusiveIndividualClientDetails | null;
  entity: FinclusiveEntityClientDetails | null;
}
