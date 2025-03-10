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
