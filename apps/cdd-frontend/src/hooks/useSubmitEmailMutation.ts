import { useMutation } from 'react-query';
import { z } from 'zod';


import axios from '../services/axios';

export type ServiceResponse = {
  result: 'success' | 'error';
};

export const emailFormSchema = z.object({
  email: z.string().email(),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept Polymesh privacy policy to continue.",
  }),
  newsletterAccepted: z.boolean(),
  devUpdatesAccepted: z.boolean(),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

const submitEmail = async (payload: EmailFormValues) => {
  const { data } = await axios.post<ServiceResponse>('email', payload);

  return data;
};

export const useSubmitEmailMutation = () => {
  return useMutation(submitEmail);
};

export default useSubmitEmailMutation;
