import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
    Icon,
    StepNumber,
  StepDescription,
} from '@chakra-ui/react';
import { BsCheck, BsX } from 'react-icons/bs';
import { BiLoaderCircle } from 'react-icons/bi';

import { useResultPageContext } from '../ResultPageContext';
import { VerificationStatus } from '../types.d';
import { motion } from 'framer-motion';

export type StepTemplateProps = {
    index: number;
    title: string;
    children?: React.ReactNode;
}

const AnimatedIcon = () => {
    return (
        <motion.span
          animate={{ rotate: 360 }}
          style={{ padding: 0, lineHeight: 0.75}}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
          <Icon as={BiLoaderCircle} color="blue.500" />
        </motion.span>
    );
  };

const StepTemplate: React.FC<StepTemplateProps> = ({ index, title, children }) => {  
    const { isActiveStep, stepStatus, onNext } = useResultPageContext();
    const isActive = isActiveStep(index);
    const localStatus = stepStatus[index];

    useEffect(() => {
        if(localStatus === VerificationStatus.SUCCESS){
            onNext();
        }
    }, [localStatus, onNext])

    const stepIcon = useMemo(() => {
        switch (localStatus) {
            case VerificationStatus.SUCCESS:
                return <Icon as={BsCheck} color="green.500" />;
            case VerificationStatus.FAILED:
                return <Icon as={BsX} color="red.500" />;
            case VerificationStatus.PROCESSING:
                return <AnimatedIcon />;
            default:
                return <StepNumber />;
        }
    }, [localStatus]);

    
  return (
    <Step>
      <StepIndicator>
        <StepStatus complete={stepIcon} incomplete={stepIcon} active={stepIcon} />
        <StepSeparator />
      </StepIndicator>
   
      <Box flexShrink="0" minH={12} w="250px">
        <StepTitle>{title}</StepTitle>
        {isActive && (
        <StepDescription>
            {children}
        </StepDescription>
      )}

      </Box>
    </Step>
  );
};

export default StepTemplate;
