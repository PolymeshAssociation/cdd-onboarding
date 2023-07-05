import React from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import constants from '../../config/constants';
import { useCaptcha } from '../../hooks';

import './style.css'

type HCaptchaComponentProps = {
  onTokenChange?: (token?: string) => void;
} & BoxProps;

const HCaptchaComponent: React.FC<HCaptchaComponentProps> = ({ onTokenChange, ...rest }) => {
  const { captchaRef, setToken } = useCaptcha();
  const theme = useColorModeValue("light", "dark");
  const siteKey = constants.H_CAPTCHA_SITE_KEY;

  const onChange = (token?: string) => {
    if(onTokenChange) {
      onTokenChange(token);
    }
  };

  const onVerify = (newToken: string) => {
    setToken(newToken);
    onChange(newToken);
  };

  const onError = () => {
    setToken(null);
    onChange();
  };

  const onExpire = () => {
    setToken(null);
    onChange();
  };

  const onLoad = () => {
    captchaRef.current?.execute();
  };

  if (!siteKey) {
    return null;
  }

  return (
    <Box mt={4} borderColor="unset" id="captcha-container" {...rest}>
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onError={onError}
        onExpire={onExpire}
        onLoad={onLoad}
        theme={theme}
      />
    </Box>
  );
};

export default HCaptchaComponent;
