import { useState, useEffect, useCallback } from 'react';
import { BrowserExtensionSigningManager } from '@polymeshassociation/browser-extension-signing-manager';

import { logger } from '../services/logger';
import config from '../config/constants';
export interface AddressObject {
  address: string;
  name?: string;
}

export type PolyNetwork = 'local' | 'staging' | 'testnet' | 'mainnet';

type UsePolyWallerInput = {
  network: PolyNetwork;
};

type AddressWithName = {
  address: string;
  name: string;
};

export type UseBrowserSigningManager = (input: UsePolyWallerInput) => {
  connectToWallet: () => Promise<void>;
  isWalletAvailable: boolean;
  isCorrectNetwork: boolean;
  allAddresses: AddressWithName[];
  selectedAddress: string | null | AddressWithName;
};

export const useBrowserSigningManager: UseBrowserSigningManager = ({
  network,
}) => {
  const [allAddresses, setAllAddresses] = useState<AddressWithName[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<
    string | null | AddressWithName
  >(null);
  const [browserSigner, setBrowserSigner] =
    useState<BrowserExtensionSigningManager>();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!browserSigner) {
      logger.warn('No Polymesh wallet has been connected');
      setIsWalletAvailable(false);
      return;
    }

    logger.debug('Polymesh wallet is present');

    setIsWalletAvailable(true);
    const [accountsWithMeta, walletNetworkInfo] = await Promise.all([
      browserSigner.getAccountsWithMeta(),
      browserSigner.getCurrentNetwork(),
    ]);

    if (walletNetworkInfo) {
      setIsCorrectNetwork(walletNetworkInfo.name === network);
    } else {
      logger.debug('wallet info was null, assuming network agnostic wallet');
      setIsCorrectNetwork(true);
    }

    logger.debug('Found accounts: ', accountsWithMeta);

    const addresses = accountsWithMeta.map(({ address, meta }) => ({
      address,
      name: meta.name,
    })) as AddressWithName[];

    logger.debug('Found addresses: ', addresses);

    setAllAddresses(addresses);

    if (addresses.length === 1) {
      setSelectedAddress(addresses[0]);
    }
  }, [network, browserSigner]);

  const connectToWallet = useCallback(async () => {
    logger.debug('Connecting to Polymesh Wallet...');
    const browserSigner = await BrowserExtensionSigningManager.create({
      appName: 'onboarding',
      ss58Format: config.SS58_FORMAT,
      extensionName: 'polywallet',
    });

    setBrowserSigner(browserSigner);
  }, []);

  useEffect(() => {
    async function reload() {
      if (browserSigner) {
        browserSigner.onAccountChange(async () => {
          return loadAddresses();
        });

        browserSigner.onNetworkChange(async () => {
          return loadAddresses();
        });
      }

      await loadAddresses();
    }
    reload();
  }, [browserSigner, loadAddresses]);

  return {
    connectToWallet,
    isWalletAvailable,
    isCorrectNetwork,
    allAddresses,
    selectedAddress,
    setSelectedAddress,
  };
};

export default useBrowserSigningManager;
