import { useQuery } from 'react-query';

import axios from '../services/axios';

export type ApplicationInfo = {
  provider: string;
  timestamp: string;
};

export type GetAddressApplicationsServiceResponse = {
  address: string;
  applications: ApplicationInfo[];
  did?: string;
};

type Payload = {
  address: string | null;
};

const getAddressApplications = async ({ address }: Payload) => {
  if(address === null) {
    return null;
  }
  
  const { data } = await axios.get<GetAddressApplicationsServiceResponse>(`/applications/${address}`);

  return data;
};

export const useGetAddressApplicationsQuery = (address: string | null, enabled: boolean) => {
  return useQuery(
    ['applications', address],
    () => getAddressApplications({ address }),
    { enabled: !!address && enabled, retry: 1, retryDelay: 500, refetchOnWindowFocus: false },
  );
};

export default useGetAddressApplicationsQuery;
