import { Box, Icon } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { BsFillGearFill } from 'react-icons/bs';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import { VerificationStatus } from './types.d';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

const useTimer = (callback: () => void, delay: number | null) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

const VerificationStatusIcon: React.FC<{
  status: VerificationStatus;
}> = ({ status }) => {
  const controls = useAnimation();
  const isStatus =
    status !== VerificationStatus.NONE &&
    status !== VerificationStatus.PROCESSING;

  useEffect(() => {
    if (isStatus) {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.75 },
      });
    } else {
      controls.start({
        rotate: 180,
        transition: {
          duration: 2.5,
          repeat: Infinity,
        },
      });
    }
  }, [isStatus, controls]);

  if (
    status === VerificationStatus.NONE ||
    status === VerificationStatus.PROCESSING
  ) {
    return (
      <MotionBox
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
  } else if (status === VerificationStatus.SUCCESS) {
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

export default VerificationStatusIcon;
