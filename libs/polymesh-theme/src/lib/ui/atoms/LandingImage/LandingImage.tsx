import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

type LandingImageProps = {
  src: string;
  alt: string;
};

export const LandingImage: React.FC<LandingImageProps> = ({ src, alt }) => {
  return (
      <Box
        h="2000px"
        w="500px"
        bgImage={src}
        bgRepeat="no-repeat"
        bgPosition="right top"
        bgSize="contain"
        top="46px"
        right={0}
        position="absolute"
        zIndex={0}
        display={{ base: 'none', md: 'block' }}
      />
  );
};

export default LandingImage;
