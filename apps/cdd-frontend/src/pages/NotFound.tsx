import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export const NotFound = () => {
  return (
    <Box textAlign="center" py="calc(50% - 350px)" px={6}>
      <Heading
        display="inline-block"
        as="h1"
        size="4xl"
        >
        404
      </Heading>
      <Text fontSize="2xl" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button
        as={RouterLink}
        to="/"
        colorScheme="navy"
        variant="ghost">
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFound;