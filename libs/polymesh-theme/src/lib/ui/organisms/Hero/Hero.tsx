import { Heading, VStack, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { SectionContainer } from '../../atoms';

export type HeroProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  cta?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
};
export const Hero: React.FC<HeroProps> = ({ title, subtitle, cta, align }) => {
  let justify = 'flex-start';
  const headingColor = useColorModeValue("text.light", "text.dark")
  const subheadingColor = useColorModeValue("gray.500", "gray.100")

  if (align === 'center') {
    justify = 'center';
  }

  if (align === 'right') {
    justify = 'flex-end';
  }

  return (
    <SectionContainer>
    <Flex justify={justify} py="6vh">
      <VStack maxW="50%" align={justify}>
        <Heading as="h1" size="4xl" my="0.5rem !important" color={headingColor}>
          {title}
        </Heading>
        <Heading as="h2" size="xl" color={subheadingColor} my="0.75rem !important">
          {subtitle}
        </Heading>
        {Boolean(cta) && <Box mt="2.5rem !important">{cta}</Box>}
      </VStack>
    </Flex>
    </SectionContainer>
  );
};

export default Hero;
