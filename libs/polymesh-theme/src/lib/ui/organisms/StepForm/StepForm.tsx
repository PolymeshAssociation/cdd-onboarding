import React from 'react';
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { LogoCircle } from '../../atoms';
import { FooterCopy, Header } from '../../molecules';

import { StepProps } from './components';
import StepFormContextProvider from './components/StepFormContextProvider';
import StepFormProgress from './components/StepFormProgress';

export type StepFromProps = {
  title: string;
  showNavigation?: boolean;
  children: React.ReactElement<StepProps>[];
  onCompleted?: () => void;
  initialStep?: number;
};

export const StepForm: React.FC<StepFromProps> = ({
  title,
  initialStep = 0,
  children,
}) => {
  const logoVariant = useColorModeValue('color', 'b&w')

  return (
    <StepFormContextProvider initialStep={initialStep}>
      <Header display={{ md: 'none' }} />
      <Flex h="100vh" alignItems={{ base: 'center', md: 'stretch'}} py={{ base: '4rem', sm: 'unset' }}>
        <Flex
          h="100%"
          minW={{ md: '5rem', lg: '20rem', xl: '25rem', '2xl': '40rem' }}
          direction="column"
          justify="space-between"
          align="center"
          px={{ base: 'none', md: '2rem' }}
          pt="1.5rem"
          pb="1rem"
          boxShadow="0.5rem 0 0.5rem -0.25rem rgba(0,0,0,0.75)"
          display={{ base: 'none', md: 'flex' }}
        >
          <LogoCircle variant={logoVariant} boxSize="120px" mt="5rem" link="/" />
          <Box>
            <Heading mb="1rem">{title}</Heading>
            <StepFormProgress />
          </Box>
          <FooterCopy borderTop="none" px="unset" compact textAlign="center" />
        </Flex>

        <Flex
          h="100vh"
          direction="column"
          pt={{ base: '1rem', md: '7rem' }}
          pb={{ base: "8rem", md: "unset" }}
          flexGrow={1}
          px={{ base: '0.5rem', sm: '2rem', md: '5rem' }}
          justify={{ base: 'flex-start', md: 'center' }}        
          overflow="hidden"
          overflowY="scroll"
        >
          {React.Children.map(children, (child, index) => {
            return React.cloneElement(child as unknown as React.ReactElement, {
              index,
            });
          })}
        </Flex>
      </Flex>
    </StepFormContextProvider>
  );
};

export default StepForm;
