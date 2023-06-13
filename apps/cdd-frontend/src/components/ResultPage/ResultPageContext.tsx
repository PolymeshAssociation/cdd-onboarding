import { createContext, useContext } from 'react';
import { ResultPageContextValue } from './types.d';

export const ResultPageContext = createContext<ResultPageContextValue>(
  {} as ResultPageContextValue
);

export const useResultPageContext = () => {
  const context = useContext(ResultPageContext);
  if (context === undefined) {
    throw new Error(
      'useResultPageContext must be used within a ResultPageContextProvider'
    );
  }
  return context;
}