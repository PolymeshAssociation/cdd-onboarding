import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

type LandingImageProps = {
  src: string;
  alt: string;
};

export const LandingImage: React.FC<LandingImageProps> = ({ src, alt }) => {
  return (
    <Flex w="100vw" h="700px" top={0} left={0} overflow="hidden" zIndex={-100} position="absolute" display={{ base: "none", md: "flex"}}>
      <Box
        ml="50%"
        w="50%"
        h="100%"
        zIndex={-100}
        bgImage={src}
        bgRepeat="no-repeat"
        bgPosition="right top"
        bgSize="contain"
      />
    </Flex>
  );
};

export default LandingImage;
