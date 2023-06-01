import {
  Box,
  Card,
  HStack,
  Heading,
  Icon,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
  useColorModeValue,
  useSteps
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsFillGearFill } from 'react-icons/bs';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

type VerificationStatuses = 'success' | 'failed' | 'none' | 'processing';

const stepsCount = 5;

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

const VerificationStatusIcon = ({
  status,
}: {
  status: VerificationStatuses;
}) => {
  const controls = useAnimation();
  const isStatus = status !== 'none' && status !== 'processing';

  useEffect(() => {
    if (isStatus) {
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
  }, [isStatus, controls]);

  if (status === 'none' || status === 'processing') {
    return (
      <MotionBox
        //  boxSize="12px"
        borderRadius="50%"
        thickness="3px"
        isIndeterminate
        animate={controls}
        exit={{ scale: 0, opacity: 0, transition: { duration: 1 } }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon as={BsFillGearFill} boxSize={12} opacity={1} />
      </MotionBox>
    );
  } else if (status === 'success') {
    return (
      <MotionIcon
        as={FaCheckCircle}
        boxSize={12}
        color="green.500"
        animate={controls}
      />
    );
  } else {
    return (
      <MotionIcon
        as={FaTimesCircle}
        boxSize={12}
        color="red.500"
        animate={controls}
      />
    );
  }
};

const VerificationHeading = ({ status }: { status: VerificationStatuses }) => {
  const text = status === 'success' ? 'Success!' : 'Failed!';
  const color = status === 'success' ? 'green.500' : 'red.500';
  const description =
    status === 'success'
      ? 'You have successfully verified your account.'
      : 'Something went wrong. Please try again.';

  return (
    <VStack justifyContent="center" alignItems="center" flex={1}>
      <Heading size="lg">{text}</Heading>
      <Text fontSize="xl" color={color} textAlign="center">
        {description}
      </Text>
    </VStack>
  );
};

type VerificationCardContentProps = {
  status: VerificationStatuses;
  children?: React.ReactNode;
};

const VerificationCardContent = ({
  status,
  children,
}: VerificationCardContentProps) => {


  console.log('status', status);

  return (
    <Card
      minH="360px"
      minW="550px"
      display="flex"
      p="2rem"
      flexDirection="row"
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
      mx="auto"
      flex={1}
      gap="2rem"
    >
      <Box
        w="100%"
        h="200px"
        bg="pink.500"
        minW={{ base: '100%', md: '40%' }}
        maxW="40%"
        borderRadius={8}
        display="flex"
      ></Box>

      <Box w="100%" flexGrow={1} position="relative">
        <HStack>
          <VerificationStatusIcon status={status} />
          <Heading size="2xl">Polymesh Identity</Heading>
        </HStack>
        {children && children}
      </Box>
    </Card>
  );
};

type VerificationProgressProps = {
  activeStatusStep: number;
  stepStatuses?: {
    [key: number]: VerificationStatuses;
  };
};

const VerificationProgressContent = ({
  activeStatusStep,
  stepStatuses,
}: VerificationProgressProps) => {
  const failedColor = useColorModeValue('red.500', 'red.200');
  const successColor = useColorModeValue('green.500', 'green.200');
  const statuses = Object.values(stepStatuses || []);


  const isSuccessful = useMemo(() => {

    if (statuses.length < stepsCount) {
      return "Processing"
    } else if (statuses.every((status) => status === 'success' && statuses.length === stepsCount)) {
      return "Success"
    } else {
      return "Failed"
    }
  }, [statuses]);

  

  const steps = [
    { title: 'Unlocking the Secrets ...' },
    { title: 'Unraveling the Threads. ..' },
    { title: 'Exploring the Data Mines ...' },
    { title: 'Decrypting the Enigma ...' },
    { title: isSuccessful },
  ];

  console.log("stepStatuses ", stepStatuses, steps)
 
  const stepIcon = (stepIndex: number) => {
    const status = stepStatuses?.[stepIndex];

    if (status === 'success') {
      return <Icon as={FaCheckCircle} boxSize="1.3rem" color={successColor} />;
    }
    if (status === 'failed') {
      return <Icon as={FaTimesCircle} boxSize="1.3rem" color={failedColor} />;
    }

    return <StepNumber />;
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    setActiveStep(activeStatusStep);
  }, [activeStatusStep, setActiveStep]);


  return (
    <Box mt={12}>
      <Stepper
        borderColor={"purple"}
        height="260px"
        ringColor={"red"}

        orientation="vertical"
        size="sm"
        index={activeStep}
        gap="2"
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator color="white">
             <StepStatus
                complete={stepIcon(index)}
                incomplete={stepIcon(index)}
                              active={<StepNumber />}

              />  
 
              <StepSeparator />
            </StepIndicator>

          <StepTitle>{step.title}</StepTitle>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

const VerificationResultPage = () => {
  const [status, setStatus] = useState<VerificationStatuses>('none'); // none, success, failed
  const [statusCounter, setStatusCounter] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusCounter((prevCounter: number) => {
        if (prevCounter === stepsCount) {
          clearInterval(timer);
          return prevCounter;
        }
        return prevCounter + 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useTimer(() => {
    setStatus('success');
  }, 5000);

  const stepStatuses = useMemo(() => {
    const statuses: {
      [key: number]: VerificationStatuses;
    } = {};
    for (let i = 0; i <= statusCounter; i += 1) {
      // To make it fail
      // if (i === 3) {
      //   statuses[i] = 'failed';
      //   continue;
      // }
      statuses[i] = 'success';
    }

    return statuses;
  }, [statusCounter]);

  const identityStatus = useMemo(() => {
    const statuses = Object.values(stepStatuses);

    if (statuses.length < stepsCount) {
      return 'processing';
    } else
    if (statuses.includes('failed')) {
      return 'failed';
    } else if (statuses.every((status) => status === 'success')) {
      return 'success';
    } else {
      return 'processing';
    }
  }, [stepStatuses]);

  return (
    <Stack flex={1} justifyContent="center" alignItems="center" p="6">
      {status === 'processing' || status === 'none' ? (
        <Text fontSize="xl" color="gray.500" textAlign="center">
          Your Polymesh Identity is being verified. Please wait.
        </Text>
      ) : (
        <VerificationHeading status={identityStatus} />
      )}
      <HStack justifyContent="space-between" alignItems="center" flex={1}>
        <VerificationCardContent
          status={identityStatus}
          children={
            <VerificationProgressContent
              activeStatusStep={statusCounter}
              stepStatuses={stepStatuses}
            />
          }
        />
      </HStack>
    </Stack>
  );
};

export default VerificationResultPage;
