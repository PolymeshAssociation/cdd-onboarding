import { useMutation } from 'react-query';

import axios from '../services/axios';

export type ServiceResponse = {
    valid: boolean;
    previousLinks: string[];
}

const verifyAddress = async (address: string) => {
    const { data } = await axios.get<ServiceResponse>(`/verify/${address}`);

    return data;
};



export const useVerifyAddressMutation = () => {
    return useMutation(verifyAddress);
};

export default useVerifyAddressMutation;