import React from 'react';
import { Box } from '@chakra-ui/react';

type LandingImageProps = {
  src: string;
  alt: string;
};

export const LandingImage: React.FC<LandingImageProps> = ({ src, alt }) => {
  return (
      <Box
        h={{ md: '60vh', lg: '75vh', xl: "80vh", '2xl': "100vh"}}
        maxH={{ base: 800, '2xl': "unset"}}
        w="100vw"
        bgImage={src}
        bgRepeat="no-repeat"
        bgPosition={{ md: "50vw -50px", xl: "50vw 70px",'2xl': "50vw -10px" }}
        bgSize={{ md: "95% 100%", lg: "60% 100%", xl: "55% 85%", '2xl': "30% 90%" }}
        mr={{ '2xl': -24}}
        top={{ md: -48, xl: -64 }}
        right={0}
        position="absolute"
        zIndex={0}
        display={{ base: 'none', md: 'block' }}
      />
  );
};

export default LandingImage;
