import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";

import { FormContext } from '@polymeshassociation/polymesh-theme/ui/organisms';
import { Box, Input, Text } from '@chakra-ui/react';
import { addressZ } from "@cdd-onboarding/cdd-types/utils";
import { API_URL } from '../../../config/constants';

const schema = z.object({
  address: addressZ
});

export const FirstStep: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const { onNext } = useContext(FormContext);

  const onSubmit = (data: unknown) => {
    console.log(data);
    onNext();
  };

  console.log(errors)

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="500px">
        <Text mb="0.5rem" fontSize="sm" >
          Polymesh Address {API_URL}
        </Text>
        <Input placeholder="Polymesh Address" size="lg" {...register("address")} />
        {errors.address?.message && <Text>{errors.address?.message.toString()}</Text>}
      </Box>
    </form>
  );
};

export default FirstStep;
