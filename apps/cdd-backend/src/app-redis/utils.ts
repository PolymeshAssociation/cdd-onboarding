export const netkiAvailableCodesPrefix = 'netki-codes' as const;
export const netkiAllocatedCodePrefix = 'netki-allocated-codes:' as const;

export const netkiAddressPrefixer = (id: string) =>
  `${netkiAllocatedCodePrefix}${id}`;
