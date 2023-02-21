import { PropsWithChildren, FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import "@fontsource/poppins"

import theme from './theme';
/* eslint-disable-next-line */
export interface PolymeshThemeProps {}

export const PolymeshTheme: FC<PropsWithChildren<PolymeshThemeProps>> = ({
  children,
}) => {
  return <ChakraProvider theme={theme} children={children} />;
};

export default PolymeshTheme;
