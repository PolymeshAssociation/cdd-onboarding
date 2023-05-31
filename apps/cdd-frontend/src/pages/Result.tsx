import { useParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Flex,
  Spacer,
  Text,
  Center,
  Circle,
  useColorModeValue,
  Heading,
  Card,
  CircularProgress,
  Icon,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BsPersonFill, BsPersonFillGear, BsFillGearFill } from 'react-icons/bs';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SectionContainer } from '@polymeshassociation/polymesh-theme/ui/atoms';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

const useTimer = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

const PulsatingLoader: React.FC<{ isDone: boolean }> = ({ isDone }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isDone) {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.75 },
      });
    } else {
      controls.start({
        // scale: [1, 1.5, 0.75, 1.45],
        // opacity: [1, 0.5, 1],
        rotate: 180,
        transition: {
          duration: 2.5,
          repeat: Infinity,
        },
      });
    }
  }, [isDone, controls]);

  return (
    <Box
      position="relative"
      top="-90px"
      right="-100px"
      boxSize="84px"
      bg="pink.500"
      borderRadius="50%"
    >
      <AnimatePresence>
        {isDone ? (
          <Icon as={FaCheckCircle} boxSize="85px" opacity={1} color="green.600" />
        ) : (
          <MotionBox
            boxSize="89px"
            borderRadius="50%"
            thickness="3px"
            isIndeterminate
            animate={controls}
            exit={{ scale: 0, opacity: 0, transition: { duration: 1 } }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={BsFillGearFill} boxSize={90} opacity={1} />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

const VerificationResultPage = () => {
  const [done, setDone] = useState(false); // none, success, failed
  const bg = useColorModeValue('gray.50', 'gray.900');

  useTimer(() => setDone(true), 4000);

  return (
    <SectionContainer>
      <Heading mx="auto" mb="2rem" size="3xl">
        Congratulations!
      </Heading>
      <Text fontSize="xl" color="green.500" textAlign="center">
        You have successfully verified your account.
      </Text>
      <Card
        minW="550px"
        minH="300px"
        display="flex"
        p="2rem"
        flexDirection="row"
        mx="auto"
        gap="2rem"
      >
        <Box
          w="100%"
          h="200px"
          bg="pink.500"
          maxW="40%"
          borderRadius={8}
          display="flex"
        >
          <Box position="relative">
            <Icon as={BsPersonFillGear} boxSize={180} />
            <PulsatingLoader isDone={done} />
          </Box>
        </Box>
        <Box w="100%" flexGrow={1} position="relative">
          <Heading size="2xl">Polymesh Identity</Heading>
          <Box position="absolute" bottom="0" right="0" textAlign="center" w="100%">
            <Text
              borderColor="green.500"
              borderWidth={3}
              borderStyle="solid"
              p="0.5rem"
              borderRadius={5}
              fontSize="1.5rem"
              fontWeight={600}
              color="green"
              textTransform="uppercase"
              display="inline-block"
            >
              Verified
            </Text>
          </Box>
        </Box>
      </Card>
    </SectionContainer>
  );
};

export default VerificationResultPage;
