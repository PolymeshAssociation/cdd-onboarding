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
    <Flex justify={justify} py={{ base: '1rem', md: '2rem'}} w="100%">
      <VStack maxW={{ base: '100%', md: '50%'}} align={justify}>
        <Heading as="h1" size={{ base: '4xl', sm: '3xl' }} my="0.5rem !important" color={headingColor} lineHeight="1.5em">
          {title}
        </Heading>
        <Heading as="h2" size="lg" color={subheadingColor} my="0.75rem !important" lineHeight="1.5em">
          {subtitle}
        </Heading>
        {Boolean(cta) && <Box mt="2.5rem !important" w="100%">{cta}</Box>}
      </VStack>
    </Flex>
    </SectionContainer>
  );
};

export default Hero;
