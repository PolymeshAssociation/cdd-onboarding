import React, { createContext, useContext, useState, useMemo } from 'react';

interface HCaptchaContextType {
  verified: boolean;
  setVerified: (verified: boolean) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

const HCaptchaContext = createContext<HCaptchaContextType>({
  verified: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setVerified: () => {},
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
});

export const useHCaptcha = () => useContext(HCaptchaContext);

export const HCaptchaProvider: React.FC<{children: React.ReactNode }> = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo(() => ({ verified, setVerified, token, setToken }), [verified, token])

  return (
    <HCaptchaContext.Provider value={value}>
      {children}
    </HCaptchaContext.Provider>
  );
};
