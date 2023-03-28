import { Switch, Flex, Icon, useColorMode } from '@chakra-ui/react';
import { FC, useCallback } from 'react';
import { CiDark, CiLight } from 'react-icons/ci';

export const ColorModeSwitch: FC = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const mode = colorMode === 'dark' ? true : false;

  const onChange = useCallback(() => {
    toggleColorMode();
  }, [toggleColorMode]);

  return (
    <Flex align="center">
      <Icon as={CiLight} />
      <Switch size="md" onChange={onChange} isChecked={mode} mx="0.5rem" />
      <Icon as={CiDark} />
    </Flex>
  );
};

export default ColorModeSwitch;
