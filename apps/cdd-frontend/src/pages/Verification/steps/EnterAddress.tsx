import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { Box, Input, Text, CircularProgress } from '@chakra-ui/react';

import { FormContext, FormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms';
import { addressZ } from "@cdd-onboarding/cdd-types/utils";

import useVerifyAddressMutation from '../../../hooks/useVerifyAddressMutation'
import { VerificationState } from './index.d';

const schema = z.object({
  address: addressZ
});

type FormValues = z.infer<typeof schema>;

type EnterAddressProps = {
  state: VerificationState;
  setState: (state: VerificationState) => void;
}

export const EnterAddress: React.FC<EnterAddressProps> = ({ state, setState }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { onNext } = useContext(FormContext);
  const { mutate, isLoading, isSuccess } = useVerifyAddressMutation();
  const { address } = state;

  const onSubmit = ({ address }: FormValues) => {
    setState({ address })
    mutate(address)    
  };

  useEffect(()=>{
    if(isSuccess){
      onNext();
    }
  }, [isSuccess])

  console.log(isLoading, isSuccess)

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="500px">
        <Text mb="0.5rem" fontSize="sm" >
          Polymesh Address
        </Text>
        <Input placeholder="Polymesh Address" size="lg" {...register("address")} value={address} />
        {errors.address?.message && <Text>{errors.address?.message.toString()}</Text>}
      </Box>
      <FormNavigation nextStepLabel="Get started" nextIsLoading={isLoading} nextLoadingLabel={<><CircularProgress size="1.5rem" isIndeterminate color='white' mr="1rem" /> Verifying...</>} />
    </form>
  );
};

export default EnterAddress;
