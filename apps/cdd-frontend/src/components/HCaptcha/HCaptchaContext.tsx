import HCaptcha from '@hcaptcha/react-hcaptcha';
import React, { createContext, useState, useMemo, useRef } from 'react';

interface HCaptchaContextType {
  verified: boolean;
  setVerified: (verified: boolean) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  captchaRef: React.RefObject<HCaptcha>;
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const HCaptchaContext = createContext<HCaptchaContextType>({
  verified: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setVerified: () => {},
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
  captchaRef: { current: null },
  isLoaded: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLoaded: () => {},
});


export const HCaptchaProvider: React.FC<{children: React.ReactNode }> = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const value = useMemo(() => ({ verified, setVerified, token, setToken, captchaRef, isLoaded, setIsLoaded }), [verified, token, captchaRef, isLoaded]);

  return (
    <HCaptchaContext.Provider value={value}>
      {children}
    </HCaptchaContext.Provider>
  );
};
