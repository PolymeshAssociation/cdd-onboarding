/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Button,
  Flex,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  Heading,
  keyframes,
  useDimensions,
  BoxProps,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardBackspace } from 'react-icons/md';
import React, { useEffect, useRef, createContext, useContext } from 'react';
import { Logo } from '../../atoms';
import { BsCheck2Square, BsSquare } from 'react-icons/bs';
import { FooterCopy } from '../../molecules';

export type StepProps = {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  index?: number;
  nextStepLabel?: React.ReactNode;
};

type FromContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: Array<Pick<StepProps, 'title'>>;
  addStep: (step: Pick<StepProps, 'title'>) => void;
  onNext: () => void;
  onBack: () => void;
};

export const FormContext = createContext<FromContextValue>({} as FromContextValue);

const FormContextProvider = ({ children, initialStep = 0 }: { children: React.ReactNode, initialStep?: number }) => {
  const [activeStep, setActiveStep] = React.useState(initialStep);
  const [steps, setSteps] = React.useState<Pick<StepProps, 'title'>[]>([]);

  const onNext = () => {
    setActiveStep(activeStep + 1);
  };

  const onBack = () => {
    setActiveStep(activeStep - 1);
  };

  const addStep = (step: Pick<StepProps, 'title'>) => {
    setSteps((prev) => {
        if(prev.some((s) => s.title === step.title)) {
            return prev;
        }

        return [...prev, step]
    });
  };

  const api = { activeStep, setActiveStep, onNext, onBack, steps, addStep };

  return <FormContext.Provider value={api}>{children}</FormContext.Provider>;
};

export const Step: React.FC<StepProps> = ({
  title,
  subTitle,
  index,
  children,
  nextStepLabel = 'Next Step',
}) => {
  const { addStep, activeStep } = useContext(FormContext);

  useEffect(() => {
    addStep({ title });
  }, [title]);

  if (index !== activeStep) {
    return null;
  }

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      }}
    >
      <Heading mb="2rem" as="h1" size="2xl">
        {title}
      </Heading>
      {subTitle && <Heading>{subTitle}</Heading>}
      {children}
      <FormNavigation nextStepLabel={nextStepLabel} />
    </Box>
  );
};

export const StepFormNavigation: React.FC = () => {
  const { activeStep, steps } = useContext(FormContext);

  return (
    <List>
      {steps.map(({ title }, index) => (
        <ListItem
          key={title}
          display="flex"
          alignItems="center"
          py="0.5rem"
          fontSize="1rem"
        >
          <ListIcon
            as={index < activeStep ? BsCheck2Square : BsSquare}
            color="green.500"
            mr="1rem"
            boxSize="1rem"
          />
          <Text
            fontWeight={index === activeStep ? 'bold' : 'unset'}
            color={index === activeStep ? 'gray.900' : 'gray.400'}
          >
            {title}
          </Text>
        </ListItem>
      ))}
    </List>
  );
};

export const FormNavigation: React.FC<Pick<StepProps, 'nextStepLabel'>> = ({nextStepLabel}) => {
  const { onBack, activeStep, steps } = useContext(FormContext);

  return (
    <Stack mt="2rem" gap="1rem" direction="row" alignItems="center">
      {activeStep > 0 && (
        <Button
          onClick={onBack}
          leftIcon={<MdKeyboardBackspace />}
          variant="ghost"
        >
          Back
        </Button>
      )}
      <Button
        isDisabled={activeStep === steps.length - 1}
        colorScheme="navy"
        size="lg"
        type="submit"
        form="stepForm"
      >
        {nextStepLabel}
      </Button>
    </Stack>
  );
};

export type StepFromProps = {
  title: string;
  showNavigation?: boolean;
  children: React.ReactElement<StepProps>[];
  onCompleted?: () => void;
  initialStep?: number;
};

export const StepForm: React.FC<StepFromProps> = ({
  showNavigation,
  title,
  initialStep = 0,
  children,
}) => {
  return (
    <FormContextProvider initialStep={initialStep}>
      <Flex h="100vh" alignItems="stretch">
        <Flex
          h="100%"
          minW="25rem"
          direction="column"
          justify="space-between"
          px="2rem"
          pt="1.5rem"
          pb="1rem"
          boxShadow="0.5rem 0 0.5rem -0.25rem rgba(0,0,0,0.75)"
        >
          <Logo height="1.5rem" />
          <Box>
            <Heading mb="1rem">{title}</Heading>
            <StepFormNavigation />
          </Box>
          <FooterCopy borderTop="none" px="unset" compact textAlign="center" />
        </Flex>

        <Flex
          h="100%"
          direction="column"
          py="2rem"
          flexGrow={1}
          px="5rem"
          justify="center"
          overflow="hidden"
        >
          {/* <AnimatePresence>
            {steps.map((step, index) =>
              index === activeStep ? (
                <Box
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={step.title}
                  w="100%"
                >
                  <Step {...step} />
                </Box>
              ) : null
            )}
          </AnimatePresence> */}
          {React.Children.map(children, (child, index) => {
            return React.cloneElement(child as unknown as React.ReactElement, {
              index,
            });
          })}
        </Flex>
      </Flex>
    </FormContextProvider>
  );
};

export default StepForm;