import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

type ErrorLoadingProviderLinkProps = {
    isError: boolean;
}

export const ErrorLoadingProviderLink: React.FC<ErrorLoadingProviderLinkProps> = ({
    isError,
  }) => {
    if (!isError) {
      return null;
    }
  
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="0.5rem"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error loading CDD Provider link
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Sorry there was an error generating CDD provider link please try again.
        </AlertDescription>
      </Alert>
    );
  };

  export default ErrorLoadingProviderLink;