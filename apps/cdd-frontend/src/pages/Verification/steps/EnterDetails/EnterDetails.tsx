import React, { useContext, useEffect } from 'react';
import { Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Input,
  CircularProgress,
  FormLabel,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Link,
  Checkbox,
} from '@chakra-ui/react';
import {
  StepFormContext,
  StepFormNavigation,
} from '@polymeshassociation/polymesh-theme/ui/organisms';

import { VerificationState } from '../index.d';

import {
  useSubmitEmailMutation,
  emailFormSchema,
  EmailFormValues,
} from '../../../../hooks/useSubmitEmailMutation';

type EnterDetailsProps = {
  state: VerificationState;
  setState: (state: VerificationState) => void;
};

export const EnterDetails: React.FC<EnterDetailsProps> = ({
  state,
  setState,
}) => {
  const {
    email,
    emailSubmitted,
    termsAccepted,
    newsletterAccepted,
    devUpdatesAccepted,
  } = state;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    mode: 'onChange',
    defaultValues: {
      email,
      termsAccepted,
      newsletterAccepted,
      devUpdatesAccepted,
    },
  });
  const { onNext } = useContext(StepFormContext);
  const { mutate, isLoading, isSuccess, isError, error } =
    useSubmitEmailMutation();

  const { message } = (error as AxiosError) || {};
  const onSubmit = ({
    email,
    termsAccepted,
    newsletterAccepted,
    devUpdatesAccepted,
  }: EmailFormValues) => {
    onNext();

    if (!emailSubmitted || email !== state.email) {
      mutate({
        email,
        termsAccepted,
        newsletterAccepted,
        devUpdatesAccepted,
      });
      setState({
        ...state,
        email,
        termsAccepted,
        newsletterAccepted,
        devUpdatesAccepted,
      });

      return;
    }

    onNext();
  };

  useEffect(() => {
    if (isSuccess) {
      setState({ ...state, emailSubmitted: true });

      onNext();
    }
  }, [isSuccess, onNext, setState, state]);

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="660px">
        <FormControl
          isInvalid={Boolean(errors.email?.message) || isError}
          isRequired
          mb={6}
        >
          <FormLabel>E-mail Address</FormLabel>
          <Input size="lg" {...register('email')} placeholder=" " />
          <FormErrorMessage>
            {isError ? message : errors.email?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>Please enter your e-mail address</FormHelperText>
        </FormControl>

        <FormControl
          isInvalid={Boolean(errors.termsAccepted?.message) || isError}
          isRequired
          mb={6}
        >
          <FormLabel>Privacy Policy</FormLabel>
          <Checkbox {...register('termsAccepted')}>
            I have read and accept the Polymesh privacy policy
          </Checkbox>
          <FormErrorMessage>
            {isError ? message : errors.termsAccepted?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>
            Please accept our{' '}
            <Link href="https://polymesh.network/privacy-policy" isExternal>
              Privacy Policy
            </Link>{' '}
            to start onboarding.
          </FormHelperText>
        </FormControl>

        <FormControl
          isInvalid={Boolean(errors.newsletterAccepted?.message) || isError}
        >
          <FormLabel>Polymesh Updates</FormLabel>
          <Checkbox {...register('newsletterAccepted')} mb={2}>
            Receive the monthly Polymesh email newsletter (joining 13,000+
            subscribers!)
          </Checkbox>
          <FormErrorMessage>
            {isError ? message : errors.newsletterAccepted?.message?.toString()}
          </FormErrorMessage>
          <Checkbox {...register('devUpdatesAccepted')}>
            Receive important developer updates
          </Checkbox>
          <FormErrorMessage>
            {isError ? message : errors.devUpdatesAccepted?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>
          Please check the options you want to receive occasional updates for from the Polymesh Association
          </FormHelperText>
        </FormControl>
        <Text mt={3} color="gray.600" fontSize="0.75rem">
          * indicates required field
        </Text>
      </Box>
      <StepFormNavigation
        nextStepLabel="Next Step"
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

export default EnterDetails;
