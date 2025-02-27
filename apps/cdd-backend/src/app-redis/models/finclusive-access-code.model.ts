export enum FinclusiveAccessCodeTypeEnum {
  INDIVIDUAL = 1,
  ENTITY = 2,
  BOTH = 3,
}

export interface FinclusiveAccessCodeModel {
  description?: string;
  expiresAt: Date;
  isMultipleUse: boolean;
  timesUsed: number;
  type: FinclusiveAccessCodeTypeEnum;
  value: string;
}
