import React from 'react';
import { BoxProps } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import './style.css';
import HCaptchaComponent from './HCaptchaComponent';

type HCaptchaComponentProps = {
  control: any;
} & BoxProps;

const HCaptchaFormComponent: React.FC<HCaptchaComponentProps> = ({
  control, ...rest
}) => {
  const { field } = useController({
    name: 'hCaptcha',
    control,
    rules: { required: true },
  });

  const onTokenChange = (newToken?: string) => {
    field.onChange(newToken);
  }

  return (
    <HCaptchaComponent onTokenChange={onTokenChange} {...rest} />
  );
};

export default HCaptchaFormComponent;
