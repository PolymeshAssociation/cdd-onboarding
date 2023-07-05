import { useMutation } from 'react-query';
import { z } from 'zod';

import axios from '../services/axios';
import { useCaptcha, hCaptcha } from './useCaptcha';

export type GetProviderLinkServiceResponse = {
  link: string;
};

export const providerLinkSchema = z.object({
  address: z.string().nonempty(),
  provider: z.enum(['netki', 'jumio', 'fractal','mock']),
  hCaptcha,
});

export type GenerateProviderLinkPayload = z.infer<typeof providerLinkSchema>;


const generateProviderLink = async (payload: GenerateProviderLinkPayload) => {
  const { data } = await axios.post<GetProviderLinkServiceResponse>('provider-link', payload);

  return data;
};

export const useGetProviderLinkMutation = () => {
  const mutation =  useMutation(generateProviderLink);

  const { captchaRef } = useCaptcha();

  const onMutate = (payload: GenerateProviderLinkPayload) => {
    mutation.mutate(payload);
    captchaRef.current?.resetCaptcha();
  }

  return { ...mutation, mutate: onMutate }
};

export default useGetProviderLinkMutation;
