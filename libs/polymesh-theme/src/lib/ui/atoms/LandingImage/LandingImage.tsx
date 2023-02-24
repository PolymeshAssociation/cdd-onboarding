import React from 'react';
import { Box } from '@chakra-ui/react';

type LandingImageProps = {
  src: string;
  alt: string;
};

export const LandingImage: React.FC<LandingImageProps> = ({ src, alt }) => {
  return (
    <Box
      w="50vw"
      h="500px"
      position="absolute"
      top={0}
      right={0}
      zIndex={-100}
      bgImage={src}
      bgSize="100%"
      overflow="hidden"
      bgRepeat="no-repeat"
      bgPosition="right top"
    />
  );
};

export default LandingImage;
