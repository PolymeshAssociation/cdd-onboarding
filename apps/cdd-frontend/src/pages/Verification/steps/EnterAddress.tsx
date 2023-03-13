import React, { useContext, useEffect } from 'react';
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
} from '@chakra-ui/react';

import {
  FormContext,
  FormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';
import { addressZ } from '@cdd-onboarding/cdd-types/utils';

import useVerifyAddressMutation from '../../../hooks/useVerifyAddressMutation';
import { VerificationState } from './index.d';
import { AxiosError } from 'axios';

const schema = z.object({
  address: addressZ,
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
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur', defaultValues: { address } });
  const { onNext } = useContext(FormContext);
  const { mutate, isLoading, isSuccess, isError, error } = useVerifyAddressMutation();
  const { message } = error as AxiosError || {}

  const onSubmit = ({ address }: FormValues) => {
    setState({ address });
    mutate(address);
  };

  useEffect(() => {
    if (isSuccess) {
      onNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="500px">
        <FormControl isInvalid={Boolean(errors.address?.message) || isError} isRequired variant="floating">
          <Input size="lg" {...register('address')} placeholder=" " />
          <FormLabel>Polymesh Address</FormLabel>
          <FormErrorMessage>
            {isError ? message : errors.address?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>Please enter your Polymesh address to start verification</FormHelperText>
        </FormControl>
      </Box>
      <FormNavigation
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
