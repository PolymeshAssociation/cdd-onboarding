import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useController } from 'react-hook-form';
import z from 'zod';
import { useHCaptcha } from './HCaptchaContext';
import constants from '../../config/constants';

interface HCaptchaComponentProps {
  control: any;
  siteKey?: string;
}

export function withHCaptcha<T extends z.ZodObject<any>>(obj: T) {
  return obj.extend({
    hCaptcha: z.string().nonempty(),
  });
}

export const hCaptcha = z.string().nonempty();

const HCaptchaComponent: React.FC<HCaptchaComponentProps> = ({ control }) => {
  const { token, setToken } = useHCaptcha();
  const siteKey = constants.H_CAPTCHA_SITE_KEY;

  const { field } = useController({
    name: 'hCaptcha',
    control,
    defaultValue: token,
    rules: { required: true },
  });

  const captchaRef = React.useRef<HCaptcha>(null);

  useEffect(() => {
    if(token){
      field.onChange(token);
    }
  }, [field, token]);

  const onVerify = (newToken: string) => {
    setToken(newToken);
    field.onChange(newToken);
  };

  const onError = () => {
    setToken(null);
    field.onChange('');
  };

  const onExpire = () => {
    setToken(null);
    field.onChange('');
  };

  const onLoad = () => {
    captchaRef.current?.execute();
  };

  if(!siteKey) {
    return null;
  }

  return (
    <Box display={token ? 'none' : 'block'}>
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
