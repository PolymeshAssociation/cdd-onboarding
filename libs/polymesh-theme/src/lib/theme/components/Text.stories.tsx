import { VStack, Text as TextComponent } from '@chakra-ui/react';

import { PolymeshTheme } from '../../ThemeProvider';

export default {
  title: 'Typography/Text',
};

export const Text: React.FC = () => (
  <PolymeshTheme>
    <VStack align="start">
      <TextComponent size="4xl">
        4xl
      </TextComponent>
      <TextComponent size="3xl">
        3xl
      </TextComponent>
      <TextComponent size="2xl">
        2xl
      </TextComponent>
      <TextComponent size="xl">
        xl
      </TextComponent>
      <TextComponent>
        Default size
      </TextComponent>
      <TextComponent size="md">
        md
      </TextComponent>
      <TextComponent size="sm">
        sm
      </TextComponent>
      <TextComponent size="xs">
        sm
      </TextComponent>
    </VStack>
  </PolymeshTheme>
);

