import { VStack, Heading as HeadingComponent } from '@chakra-ui/react';

import { PolymeshTheme } from '../../ThemeProvider';

export default {
  title: 'Typography/Heading',
};

export const Heading: React.FC = () => (
  <PolymeshTheme>
    <VStack align="start">
      <HeadingComponent as="h1" size="4xl">
        4xl
      </HeadingComponent>
      <HeadingComponent as="h2" size="3xl">
        3xl
      </HeadingComponent>
      <HeadingComponent as="h3" size="2xl">
        2xl
      </HeadingComponent>
      <HeadingComponent as="h4" size="xl">
        xl - Default size
      </HeadingComponent>
      <HeadingComponent as="h4" size="md">
        md
      </HeadingComponent>
      <HeadingComponent as="h4" size="sm">
        sm
      </HeadingComponent>
      <HeadingComponent as="h4" size="xs">
        sm
      </HeadingComponent>
    </VStack>
  </PolymeshTheme>
);

