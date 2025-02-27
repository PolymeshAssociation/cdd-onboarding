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
