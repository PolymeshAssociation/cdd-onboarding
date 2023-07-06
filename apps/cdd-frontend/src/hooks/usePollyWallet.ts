import { useState, useEffect, useCallback } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { logger } from '../services/logger';
export interface AddressObject {
  address: string;
  name?: string;
}

export type PolyNetwork = 'local' | 'staging' | 'testnet' | 'mainnet';

export interface Accounts {
  get(): Promise<AddressObject[]>;
  subscribe(
    handler: (update: AddressObject[]) => void | unknown
  ): () => Record<string, unknown>;
}

export type NetworkMeta = {
  name: PolyNetwork;
  label?: string;
  wssUrl: string;
};

export interface InjectedNetwork {
  get: () => Promise<NetworkMeta>;
  subscribe: (cb: (network: NetworkMeta) => void) => () => void;
}

export interface PolyWallet {
  network: InjectedNetwork;
  accounts: Accounts;
  uid: unknown;
}

type UsePolyWallerInput = {
  network: PolyNetwork;
};

type AddressWithName = {
  address: string;
  name: string;
};

export type UsePolyWallet = (input: UsePolyWallerInput) => {
  connectToWallet: () => Promise<void>;
  isWalletAvailable: boolean;
  isCorrectNetwork: boolean;
  allAddresses: AddressWithName[];
  selectedAddress: string | null | AddressWithName;
};

export const usePolyWallet: UsePolyWallet = ({ network }) => {
  const [allAddresses, setAllAddresses] = useState<AddressWithName[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<
    string | null | AddressWithName
  >(null);
  const [pollyWallet, setPollyWallet] = useState<PolyWallet>();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!pollyWallet) {
      logger.warn('No Polymesh wallet has been connected');
      setIsWalletAvailable(false);
      return;
    }

    logger.debug('Polymesh wallet is present');

    setIsWalletAvailable(true);

    const networkMeta = await pollyWallet.network.get();

    setIsCorrectNetwork(networkMeta.name === network);

    const ss58Format = network === 'mainnet' ? 12 : 42;

    const foundAccounts = await web3Accounts({
      extensions: ['polywallet'],
      ss58Format,
    });

    logger.debug('Found accounts: ', foundAccounts);

    const addresses = foundAccounts.map(({ address, meta }) => ({
      address,
      name: meta.name,
    })) as AddressWithName[];

    logger.debug('Found addresses: ', addresses);

    setAllAddresses(addresses);

    if (addresses.length === 1) {
      setSelectedAddress(addresses[0]);
    }
  }, [network, pollyWallet]);

  const connectToWallet = useCallback(async () => {
    logger.debug('Connecting to Polymesh Wallet...');
    const extensions = await web3Enable('onboarding');

    const polyWallet = extensions.find(
      (ext) => ext.name === 'polywallet'
    ) as unknown as PolyWallet;

    setPollyWallet(polyWallet);
  }, []);

  useEffect(() => {
    async function reload() {
      if (pollyWallet) {
        pollyWallet.accounts.subscribe(async () => {
          await loadAddresses();
        });

        pollyWallet.network.subscribe(async () => {
          await loadAddresses();
        });
      }

      await loadAddresses();
    }
    reload();
  }, [pollyWallet, loadAddresses]);

  return {
    connectToWallet,
    isWalletAvailable,
    isCorrectNetwork,
    allAddresses,
    selectedAddress,
    setSelectedAddress,
  };
};

export default usePolyWallet;
