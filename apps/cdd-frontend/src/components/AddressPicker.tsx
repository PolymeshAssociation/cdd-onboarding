import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Input,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Tooltip,
  Link,
  MenuDivider,
  Text,
  Portal,
} from '@chakra-ui/react';
import { BiImport, BiChevronDown } from 'react-icons/bi';
import { addressZ } from '@cdd-onboarding/cdd-types/utils';

import usePolyWallet from '../hooks/usePollyWallet';
import config, { NETWORK_NAMES } from '../config/constants';

const schema = z.object({
  address: addressZ,
});

type FormValues = z.infer<typeof schema>;

type AddressPickerProps = {
  address?: string;
  onSubmit: ({ address }: FormValues) => void;
  children?: React.ReactNode;
  isError?: boolean;
  errorMessage?: string;
};

const AddressPicker: React.FC<AddressPickerProps> = ({
  onSubmit,
  children,
  address,
  isError,
  errorMessage,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { address },
  });
  const { connectToWallet, allAddresses, isCorrectNetwork, isWalletAvailable } =
    usePolyWallet({ network: config.NETWORK });

  const onSetAddress = (address: string) => {
    setValue('address', address);
    trigger('address');
  };

  useEffect(() => {
    async function init() {
      await connectToWallet();
    }

    init();
  }, [connectToWallet]);

  useEffect(() => {
    if(isValid){
        const address = getValues('address');
        onSubmit({ address });
    }
  }, [isValid, address, onSubmit, getValues]);

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="660px" minW={670} pt={2}>
        <FormControl
          isInvalid={Boolean(errors.address?.message) || isError}
          isRequired
        >
          <InputGroup>
            <Input size="md" {...register('address')} placeholder=" " />
            <Tooltip label="Pick address from Polymesh Wallet">
              <InputRightElement width="4.5rem">
                {allAddresses.length === 1 && (
                  <Button
                    onClick={() => onSetAddress(allAddresses[0])}
                    size="sm"
                    h="2rem"
                    position="absolute"
                    right="4px"
                    top="4px"
                    borderRadius="md"
                    borderWidth="1px"
                    bg="pink.800"
                    _hover={{ bg: 'pink.600' }}
                    color="white"
                    px={4}
                    py={2}
                  >
                    <Icon as={BiImport} boxSize="1.5rem" />
                  </Button>
                )}
                {allAddresses.length > 1 && (
                  <Menu>
                    <MenuButton
                      as={Button}
                      size="sm"
                      h="2rem"
                      position="absolute"
                      right="4px"
                      top="4px"
                      px={4}
                      py={1}
                      transition="all 0.2s"
                      borderRadius="md"
                      borderWidth="1px"
                      color="white"
                      bg="pink.800"
                      _hover={{ bg: 'pink.600' }}
                      _expanded={{ bg: 'pink.200' }}
                      _focus={{ boxShadow: 'outline' }}
                      rightIcon={<Icon as={BiChevronDown} boxSize="1.5rem" />}
                    >
                      <Icon as={BiImport} boxSize="1.5rem" />
                    </MenuButton>
                    <Portal>
                      <MenuList zIndex={200} maxW="100vw">
                        <MenuItem>Select Address</MenuItem>
                        <MenuDivider />
                        {allAddresses.map((address: string) => (
                          <MenuItem
                            onClick={() => onSetAddress(address)}
                            key={address}
                            maxW="calc(100% -2rem)"
                            textOverflow="ellipsis"
                            px="1rem"
                          >
                            <Text maxW="100%">{address}</Text>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Portal>
                  </Menu>
                )}
              </InputRightElement>
            </Tooltip>
          </InputGroup>

          <FormErrorMessage>
            {isError ? errorMessage : errors.address?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>
            Please enter your Polymesh address to check Identity status on Chain
          </FormHelperText>
          {isWalletAvailable && !isCorrectNetwork && (
            <FormHelperText>
              Your Polymesh Wallet is connected to the wrong network. Please
              connect to the "{NETWORK_NAMES[config.NETWORK]}" network to be
              able to automatically import addresses from your wallet.
            </FormHelperText>
          )}
          {!isWalletAvailable && (
            <FormHelperText>
              Your don't have a Polymesh Wallet connected. Approve the request
              to connect to Polymesh wallet or get from{' '}
              <Link
                color="navy"
                variant="ghost"
                bg="#fff"
                href="https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf?hl=__REACT_APP_WALLET_URL=https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf?hl__"
                target="_blank"
                isExternal
              >
                Polymesh Wallet extension
              </Link>
            </FormHelperText>
          )}
        </FormControl>

      </Box>
      {children}
    </form>
  );
};

export default AddressPicker;
