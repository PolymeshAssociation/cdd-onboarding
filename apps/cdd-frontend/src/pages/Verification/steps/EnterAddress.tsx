import React, { useContext, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Input,
  CircularProgress,
  FormLabel,
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
import {
  StepFormContext,
  StepFormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';
import { addressZ } from '@cdd-onboarding/cdd-types/utils';

import useVerifyAddressMutation from '../../../hooks/useVerifyAddressMutation';
import usePolyWallet from '../../..//hooks/usePollyWallet';
import { VerificationState } from './index.d';
import config, { NETWORK_NAMES } from '../../../config/constants';
import HCaptchaComponent, { hCaptcha } from '../../../components/HCaptcha/HCaptchaFormComponent';

const schema = z.object({
  address: addressZ,
  hCaptcha
});

type FormValues = z.infer<typeof schema>;

type EnterAddressProps = {
  state: VerificationState;
  setState: (state: VerificationState) => void;
};

export const EnterAddress: React.FC<EnterAddressProps> = ({
  state,
  setState,
}) => {
  const { address } = state;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { address },
  });
  const { onNext } = useContext(StepFormContext);
  const { mutate, isLoading, isSuccess, isError, error } =
    useVerifyAddressMutation();
  const { connectToWallet, allAddresses, isCorrectNetwork, isWalletAvailable } =
    usePolyWallet({ network: config.NETWORK });
  const { message } = (error as AxiosError) || {};
  const onSubmit = ({ address }: FormValues) => {
    setState({ address });
    mutate(address);
  };

  useEffect(() => {
    if (isSuccess) {
      onNext();
    }
  }, [isSuccess, onNext]);

  useEffect(() => {
    async function init() {
      await connectToWallet();
    }

    init();
  }, [connectToWallet]);

  const onSetAddress = (address: string) => {
    setValue('address', address);
    trigger('address');
  }

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="660px">
        <FormControl
          isInvalid={Boolean(errors.address?.message) || isError}
          isRequired
        >
          <FormLabel>Polymesh Address</FormLabel>
          <InputGroup>
            <Input size="lg" {...register('address')} placeholder=" " />
            <Tooltip label="Pick address from Polymesh Wallet">
              <InputRightElement width="4.5rem">
                {allAddresses.length === 1 && (
                  <Button
                    onClick={() => onSetAddress(allAddresses[0])}
                    size="md"
                    h="2.5rem"
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
                      size="md"
                      h="2.5rem"
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
                      {allAddresses.map((address) => (
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
            {isError ? message : errors.address?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>
            Please enter your Polymesh address to start verification
          </FormHelperText>
          {isWalletAvailable && !isCorrectNetwork && (
            <FormHelperText>
              Your Polymesh Wallet is connected to the wrong network. Please
              connect to the "{NETWORK_NAMES[config.NETWORK]}" network to be able to automatically import
              addresses from your wallet.
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

        <HCaptchaComponent control={control} />
      </Box>
      <StepFormNavigation
        nextStepLabel="Get started"
        nextIsLoading={isLoading}
        nextIsDisabled={!isValid || isLoading}
        nextLoadingLabel={
          <>
            <CircularProgress
              size="1.5rem"
              isIndeterminate
              color="white"
              mr="1rem"
            />{' '}
            Verifying...
          </>
        }
      />
    </form>
  );
};

export default EnterAddress;
