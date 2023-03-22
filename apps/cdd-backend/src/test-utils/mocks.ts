export const mockQueue = {
  add: jest.fn(),
};

export class MockPolymesh {
  public static create = jest.fn().mockResolvedValue(new MockPolymesh());

  public disconnect = jest.fn();
  public setSigningManager = jest.fn();

  public network = {
    getLatestBlock: jest.fn(),
    transferPolyx: jest.fn(),
    getSs58Format: jest.fn(),
    getNetworkProperties: jest.fn(),
    getTreasuryAccount: jest.fn(),
  };

  public assets = {
    getAsset: jest.fn(),
    getAssets: jest.fn(),
    reserveTicker: jest.fn(),
    createAsset: jest.fn(),
    getTickerReservation: jest.fn(),
    getTickerReservations: jest.fn(),
    getGlobalMetadataKeys: jest.fn(),
  };

  public accountManagement = {
    getAccount: jest.fn(),
    getAccountBalance: jest.fn(),
    inviteAccount: jest.fn(),
    freezeSecondaryAccounts: jest.fn(),
    unfreezeSecondaryAccounts: jest.fn(),
    revokePermissions: jest.fn(),
    modifyPermissions: jest.fn(),
    subsidizeAccount: jest.fn(),
    getSubsidy: jest.fn(),
    isValidAddress: jest.fn(),
  };

  public identities = {
    isIdentityValid: jest.fn(),
    getIdentity: jest.fn(),
    createPortfolio: jest.fn(),
    registerIdentity: jest.fn(),
  };

  public settlements = {
    getInstruction: jest.fn(),
    getVenue: jest.fn(),
    createVenue: jest.fn(),
  };

  public claims = {
    getIssuedClaims: jest.fn(),
    getIdentitiesWithClaims: jest.fn(),
    addClaims: jest.fn(),
    editClaims: jest.fn(),
    revokeClaims: jest.fn(),
    getCddClaims: jest.fn(),
    getClaimScopes: jest.fn(),
    addInvestorUniquenessClaim: jest.fn(),
    getInvestorUniquenessClaims: jest.fn(),
  };

  public _polkadotApi = {
    tx: {
      balances: {
        transfer: jest.fn(),
        setBalance: jest.fn(),
      },
      cddServiceProviders: {
        addMember: jest.fn(),
      },
      identity: {
        addClaim: jest.fn(),
        cddRegisterDid: jest.fn(),
      },
      sudo: {
        sudo: jest.fn(),
      },
      testUtils: {
        mockCddRegisterDid: jest.fn().mockReturnValue({
          signAndSend: jest.fn(),
        }),
      },
      utility: {
        batchAtomic: jest.fn(),
      },
    },
  };
}
