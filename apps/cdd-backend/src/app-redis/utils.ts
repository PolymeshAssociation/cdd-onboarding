export const netkiAvailableCodesPrefix = 'netki-codes' as const;
export const netkiAllocatedCodePrefix = 'netki-allocated-codes:' as const;
export const netkiBusinessAppPrefix = 'netki-business-codes:' as const;
export const netkiBusinessToAddressPrefix = 'netki-business-address:' as const;

export const netkiAddressPrefixer = (id: string) =>
  `${netkiAllocatedCodePrefix}${id}`;

export const netkiBusinessAppPrefixer = (id: string) =>
  `${netkiBusinessAppPrefix}${id}`;

export const netkiBusinessToAddressPrefixer = (address: string) =>
  `${netkiBusinessToAddressPrefix}${address}`;

export const finclusiveAvailableCodesPrefix = 'finclusive-codes' as const;

export const finclusiveAllocatedCodePrefix =
  'finclusive-individual-codes:' as const;
export const finclusiveBusinessAppPrefix = 'finclusive-entity-codes:' as const;
export const finclusiveBusinessToAddressPrefix =
  'finclusive-business-address:' as const;

export const finclusiveAddressPrefixer = (id: string) =>
  `${finclusiveAllocatedCodePrefix}${id}`;

export const finclusiveBusinessAppPrefixer = (id: string) =>
  `${finclusiveBusinessAppPrefix}${id}`;

export const finclusiveBusinessToAddressPrefixer = (address: string) =>
  `${netkiBusinessToAddressPrefix}${address}`;
