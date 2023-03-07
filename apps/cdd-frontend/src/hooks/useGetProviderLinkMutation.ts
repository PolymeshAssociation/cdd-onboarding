import { useMutation } from 'react-query';

import axios from '../services/axios';

export type ServiceResponse = {
    valid: boolean;
    previousLinks: string[];
}

type Payload = {
    address: string;
    provider: 'netki' | 'jumio';
}

const generateProviderLink = async (payload: Payload) => {
    const { data } = await axios.post<ServiceResponse>('provider-link', payload);

    return data;
};


export const useGetProviderLinkMutation = () => {
    return useMutation(generateProviderLink);
};

export default useGetProviderLinkMutation;