import {
  Button,
  HStack,
  Icon,
  StackProps,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { CiDark, CiLight } from 'react-icons/ci';

export const ModeSelector: React.FC<StackProps> = ({ children }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  const style = useMemo(() => {
    if (colorMode !== 'light') {
      return { text: 'Light', icon: CiLight };
    }
    return { text: 'Dark', icon: CiDark };
  }, [colorMode]);

  const onClick = useCallback(() => {
    toggleColorMode();
  }, [toggleColorMode]);
  return (
    <Button size="xs" variant="ghost" onClick={onClick}>
      <HStack pl="-2">
        <Icon as={style.icon} />
        <Text fontSize="xs">{style.text} mode</Text>
      </HStack>
    </Button>
  );
};

export default ModeSelector;
