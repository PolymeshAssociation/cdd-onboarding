import React, { useContext, useEffect } from 'react';
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
  EmailFormValues
} from '../../../../hooks/useSubmitEmailMutation';
import HCaptchaComponent from '../../../../components/HCaptcha/HCaptchaFormComponent';

type EnterDetailsProps = {
  state: VerificationState;
  setState: (state: VerificationState) => void;
};

export const EnterDetails: React.FC<EnterDetailsProps> = ({
  state,
  setState,
}) => {
  const { email, emailSubmitted, termsAccepted, updatesAccepted } = state;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    mode: 'onTouched',
    defaultValues: {
      email,
      termsAccepted,
      updatesAccepted,
    },
  });
  const { onNext } = useContext(StepFormContext);
  const { mutate, isLoading, isSuccess, isError, error } =
    useSubmitEmailMutation();

  const { message } = (error as AxiosError) || {};
  const onSubmit = ({ email, termsAccepted, updatesAccepted, hCaptcha }: EmailFormValues) => {
    onNext();

    if (!emailSubmitted || email !== state.email) {
      mutate({ email, termsAccepted, updatesAccepted, hCaptcha });
      setState({ ...state, email, termsAccepted, updatesAccepted });

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
            I have read and accept Polymesh privacy policy
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

        <FormErrorMessage>
            {isError ? message : errors.hCaptcha?.message?.toString()}
          </FormErrorMessage>

        <FormControl
          isInvalid={Boolean(errors.termsAccepted?.message) || isError}
        >
          <FormLabel>Polymesh Updates</FormLabel>
          <Checkbox {...register('updatesAccepted')}>
            Add me to the mailing list
          </Checkbox>
          <FormErrorMessage>
            {isError ? message : errors.updatesAccepted?.message?.toString()}
          </FormErrorMessage>
          <FormHelperText>
            Please check if you want to receive occasional updates from Polymesh
            Network.
          </FormHelperText>
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

export default EnterDetails;
