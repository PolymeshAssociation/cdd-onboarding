import {
  Button,
  HStack,
  Icon,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { CiDark, CiLight } from 'react-icons/ci';

export type ModeSelectorProps = {
  showLabel?: boolean;
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ showLabel }) => {
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
    <Tooltip label="switch theme color mode">
      <Button size="xs" variant="ghost" onClick={onClick}>
        <HStack pl="-2">
          <Icon as={style.icon} />
          {showLabel && <Text fontSize="xs">{style.text} mode</Text>}
        </HStack>
      </Button>
    </Tooltip>
  );
};

export default ModeSelector;
