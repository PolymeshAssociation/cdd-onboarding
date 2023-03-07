import React, { useEffect } from 'react'
import { FormNavigation } from '@polymeshassociation/polymesh-theme/ui/organisms'
import { VerificationState } from './index.d'

import useGetProviderLinkMutation from '../../../hooks/useGetProviderLinkMutation'

export const GoToCddProvider: React.FC<VerificationState> = ({ address, provider }) => {
  const { mutate, isLoading, isError, error } = useGetProviderLinkMutation();

  useEffect(() => {
    if(address && provider){
      mutate({ address, provider })
    }
  }, [address, provider])

  return (
    <div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>{JSON.stringify(error)}</p>}
        <FormNavigation nextStepLabel={`Go to ${provider?.toUpperCase()}`} nextIsLoading={isLoading} nextIsDisabled={isError || !address || !provider} />
    </div>
  )
}

export default GoToCddProvider