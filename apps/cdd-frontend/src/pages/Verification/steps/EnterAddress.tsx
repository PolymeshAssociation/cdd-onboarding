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
  Heading,
} from '@chakra-ui/react';
import { BiImport, BiChevronDown } from 'react-icons/bi';
import {
  StepFormContext,
  StepFormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import useVerifyAddressMutation from '../../../hooks/useVerifyAddressMutation';
import usePolyWallet from '../../..//hooks/usePollyWallet';
import { VerificationState } from './index.d';
import config, { NETWORK_NAMES } from '../../../config/constants';

import HCaptchaComponent from '../../../components/HCaptcha/HCaptchaFormComponent';
import { useStoredAddressValue, verifyAddressSchema, VerifyAddressPayload } from '../../../hooks';




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
  } = useForm<VerifyAddressPayload>({
    resolver: zodResolver(verifyAddressSchema),
    mode: 'onTouched',
    defaultValues: { address },
  });
  const { onNext } = useContext(StepFormContext);
  const { setAddress: setStoredAddress } = useStoredAddressValue();

  const { mutate, isLoading, isSuccess, isError, error, data } =
    useVerifyAddressMutation();
  const { connectToWallet, allAddresses, isCorrectNetwork, isWalletAvailable } =
    usePolyWallet({ network: config.NETWORK });
  const { message } = (error as AxiosError) || {};
  const onSubmit = ({ address, hCaptcha }: VerifyAddressPayload) => {
    setState({ address });
    mutate({ address, hCaptcha });
  };

  useEffect(() => {
    if (isSuccess && data.valid && state.address && !data.applications.length) {
      setStoredAddress(state.address);
      onNext();
    }

    if (isSuccess && !data.valid && state.address) {
      setStoredAddress(state.address);
    }
  }, [isSuccess, onNext, data, setStoredAddress, state.address]);

  const onCreateNewApplication = () => {
    if(state.address){
      setStoredAddress(state.address);
    }
    onNext();
  }

  useEffect(() => {
    async function init() {
      await connectToWallet();
    }

    init();
  }, [connectToWallet]);

  const onSetAddress = (address: string) => {
    setValue('address', address);
    trigger('address');
  };

  if (isSuccess && !data?.valid && data.identity) {
    const { validCdd } = data.identity;
    return (
      <Box>
        <Heading mb={4}>Existing Identity Found</Heading>
        <Text mb={2}>
          An identity has already been assigned to this address.
        </Text>
        {validCdd ? (
          <Text>The identity has already been verified.</Text>
        ) : (
          <>
            <Text>
              The identity assigned to this account does not have a valid CDD.
              You can proceed with a new application to re-verify yourself.
            </Text>
            <StepFormNavigation
              nextStepLabel="Create New Application"
              onNext={onCreateNewApplication}
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
          </>
        )}
      </Box>
    );
  }

  if (isSuccess && data.applications.length) {
    return (
      <Box>
        <Heading mb={4}>Existing Applications Found</Heading>
        <Text mb={2}>
          There are already existing CDD applications bound to this address{' '}
          <i>{state.address}</i>
        </Text>
        <Text mb={2}>
          It usually takes up to 2 business days for CDD provider to verify your
          identity.
        </Text>
        <Text mb={4} as="span">
          After 2 business days, if your identity is still not verified, please
          email{' '}
          <Link href="mailto:support@polymesh.network">
            support@polymesh.network
          </Link>{' '}
          with your Polymesh key address and the identity verification provider
          that you selected.
        </Text>
        <Text>
          If you wish you can proceed by creating a new CDD application.
        </Text>
        <StepFormNavigation
          nextStepLabel="Create New Application"
          onNext={onCreateNewApplication}
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
      </Box>
    );
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
                    onClick={() => onSetAddress(allAddresses[0].address)}
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
                        {allAddresses.map(({ address, name }) => (
                          <MenuItem
                            onClick={() => onSetAddress(address)}
                            key={address}

                            w={{ base: '100vw', md: '600px'}}
                            textOverflow="ellipsis"
                            px="1rem"
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Text mr={1}>{name}:</Text>
                            <Text>{address}</Text>
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
        <Text mt={3} color="gray.600" fontSize="0.75rem">
          * indicates required field
        </Text>

        <HCaptchaComponent control={control} />
      </Box>
      <StepFormNavigation
        nextStepLabel="Verify Address"
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
