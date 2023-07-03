import {
  Heading,
  VStack,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
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
  const headingColor = useColorModeValue('heading.light', 'heading.dark');
  const subheadingColor = useColorModeValue('text.light', 'gray.200');

  if (align === 'center') {
    justify = 'center';
  }

  if (align === 'right') {
    justify = 'flex-end';
  }

  return (
    <SectionContainer>
        <VStack align={justify} w="100%">
          <Heading
            as="h1"
            fontSize="3rem"
            my="0.67em !important"
            color={headingColor}
            fontWeight={600}
            lineHeight="140%"
            letterSpacing="-0.03em"
            textAlign="center"
            w="100%"
          >
            {title}
          </Heading>
          <Heading
            as="h2"
            fontSize="1.125rem"
            color={subheadingColor}
            my="0.75rem !important"
            lineHeight="1.5em"
            textAlign="center"
            w="100%"
          >
            {subtitle}
          </Heading>
          {Boolean(cta) && (
            <Box mt="2.5rem !important" w="100%">
              {cta}
            </Box>
          )}
        </VStack>
    </SectionContainer>
  );
};

export default Hero;
