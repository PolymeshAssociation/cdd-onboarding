import React, { useState } from 'react';
import {
  Box,
  chakra,
  Heading,
  shouldForwardProp,
  Text,
} from '@chakra-ui/react';
import Lottie from 'lottie-react';
import { AnimatePresence, isValidMotionProp, motion } from 'framer-motion';

import { VerificationStatus } from './types.d';
import { useResultPageContext } from './ResultPageContext';

import dots from './lottie/dots';
import confetti from './lottie/confetti';

const MotionStack = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const VerificationMessage: React.FC = () => {
  const { globalStatus, providerResult, provider } = useResultPageContext();
  const [complete, setComplete] = useState(false);

  return (
    <>
      {globalStatus === VerificationStatus.FAILED && providerResult === "failed" && provider && (
        <AnimatePresence>
          <MotionStack
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
            flex={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Heading size="2xl" display="flex" mb="2rem">
              <Text mr="-6px">Unsuccessful</Text>
            </Heading>
            <Text fontSize="xl" textAlign="center">
              We regret to inform you that your identity verification attempt through {provider.toLocaleUpperCase()} was unsuccessful.
            </Text>
            <Text fontSize="xl" textAlign="center">
              Please review your submitted details and try again.
            </Text>
          </MotionStack>
        </AnimatePresence>
      )}


      {globalStatus === VerificationStatus.FAILED && providerResult !== "failed" && (
        <AnimatePresence>
          <MotionStack
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
            flex={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Heading size="2xl" display="flex" mb="2rem">
              <Text mr="-6px">Processing</Text>
              <Lottie
                animationData={dots}
                loop
                style={{ width: 32, height: 32 }}
              />
            </Heading>
            <Text fontSize="xl" textAlign="center">
              Identity should be created soon.
            </Text>
          </MotionStack>
        </AnimatePresence>
      )}

      {globalStatus === VerificationStatus.SUCCESS && (
        <AnimatePresence>
          <MotionStack
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flex={1}
            position="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Heading size="2xl" mb="2rem">
              Success!
            </Heading>
            <Text fontSize="xl" color="green.500" textAlign="center">
              You have successfully verified your identity
            </Text>
            <Box position="absolute" top="-200px">
              {!complete && (
                <Lottie
                  animationData={confetti}
                  loop={false}
                  onComplete={() => setComplete(true)}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </Box>
          </MotionStack>
        </AnimatePresence>
      )}

      {globalStatus !== VerificationStatus.SUCCESS &&
        globalStatus !== VerificationStatus.FAILED && (
          <AnimatePresence>
            <MotionStack
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <Heading size="2xl" display="flex" mb="2rem">
                <Text mr="-6px">Processing</Text>
                <Lottie
                  animationData={dots}
                  loop
                  style={{ width: 32, height: 32 }}
                />
              </Heading>
              <Text fontSize="xl" textAlign="center">
                Please wait, we are checking some data
              </Text>
            </MotionStack>
          </AnimatePresence>
        )}
    </>
  );
};

export default VerificationMessage;
