import { Switch as SwitchComponent, useColorMode } from '@chakra-ui/react';
import { FC, useCallback } from 'react';

export type SwitchProps = {
  isDisabled?: boolean;
};

export const Switch: FC<SwitchProps> = ({ isDisabled = false }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  const mode = colorMode === 'dark' ? true : false;

  const onChange = useCallback(() => {
    toggleColorMode();
  }, [toggleColorMode]);
  return <SwitchComponent size="md" onChange={onChange} isChecked={mode} />;
};

export default Switch;
