import { useMutation } from 'react-query';

import { HCaptchaPayload } from '../components/HCaptcha';
import axios from '../services/axios';

export type ServiceResponse = {
  link: string;
};

type Payload = {
  address: string;
  provider: 'netki' | 'jumio' | 'fractal';
} & HCaptchaPayload;

const generateProviderLink = async (payload: Payload) => {
  const { data } = await axios.post<ServiceResponse>('provider-link', payload);

  return data;
};

export const useGetProviderLinkMutation = () => {
  return useMutation(generateProviderLink);
};

export default useGetProviderLinkMutation;
