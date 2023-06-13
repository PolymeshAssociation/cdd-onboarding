import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import { useHCaptcha } from './HCaptchaContext';
import constants from '../../config/constants';

const HCaptchaComponent: React.FC = () => {
  const { token, setToken } = useHCaptcha();
  const [visible, setVisible] = React.useState(false);
  const siteKey = constants.H_CAPTCHA_SITE_KEY;

  const captchaRef = React.useRef<HCaptcha>(null);

  const onVerify = (newToken: string) => {
    setToken(newToken);
  };

  const onError = () => {
    setToken(null);
  };

  const onExpire = () => {
    setToken(null);
  };

  const onLoad = () => {
    captchaRef.current?.execute();
  };

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Box display={token || !visible ? 'none' : 'block'}>
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          onVerify={onVerify}
          onError={onError}
          onExpire={onExpire}
          onLoad={onLoad}
          onOpen={() => setVisible(true)}
        />
      </Box>
      <Box pt={20} >
        <Spinner />
      </Box>
    </>
  );
};

export default HCaptchaComponent;
