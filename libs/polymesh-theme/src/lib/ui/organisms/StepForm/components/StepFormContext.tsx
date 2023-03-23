import { createContext } from 'react';
import { FromContextValue } from './index.d';

export const StepFormContext = createContext<FromContextValue>(
  {} as FromContextValue
);
