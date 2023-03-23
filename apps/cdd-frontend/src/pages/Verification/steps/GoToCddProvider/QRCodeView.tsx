import React from 'react';
import { Box, Code, Text } from '@chakra-ui/react';
import QRCode from 'react-qr-code';

export const QRCodeView: React.FC<{ link: string; provider: string }> = ({
  link,
  provider,
}) => {
  return (
    <>
      <Text textAlign="justify">
        Please use the QR code to continue verification with{' '}
        <Code>{provider.toUpperCase()}</Code> on your phone.
      </Text>
      <Box p="1rem" bg="white" my="1rem" ml="auto" mr="auto">
        <QRCode value={link} />
      </Box>
    </>
  );
};

export default QRCodeView;