import React from 'react';
import { Box } from '@chakra-ui/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import z from 'zod';

import { useHCaptcha } from './HCaptchaContext';

interface HCaptchaComponentProps {
  siteKey?: string;
}


export function withHCaptcha<T extends z.ZodObject<any>>(obj: T) {
  return obj.extend({
    hCaptcha: z.string().nonempty(),
  })
}

const HCaptchaComponent: React.FC<HCaptchaComponentProps> = ({
  siteKey = '10000000-ffff-ffff-ffff-000000000001',
}) => {
  const { token, setToken } = useHCaptcha();

  const captchaRef = React.useRef<HCaptcha>(null);

  const onVerify = (newToken: string) => {
    setToken(newToken)
  };

  const onError = () => {
    setToken(null)
  };

  const onExpire = () => {
    setToken(null)
  };

  const onLoad = () => {
    captchaRef.current?.execute();
  }

  return (
    <Box display={token ? "none" : "block"}>
    <HCaptcha
      ref={captchaRef}
      sitekey={siteKey}
      onVerify={onVerify}
      onError={onError}
      onExpire={onExpire}
      onLoad={onLoad}
    />
    </Box>
  );
};

export default HCaptchaComponent;