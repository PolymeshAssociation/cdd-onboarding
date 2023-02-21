import { Box, Button, Heading, HStack, VStack } from '@chakra-ui/react';
import type { ComponentMeta } from '@storybook/react';
import { PolymeshTheme } from '../../ThemeProvider';

export default {
  title: 'Atoms/Button',
  component: Button,
  decorators: [
    (Story) => (
      <PolymeshTheme>
        <Story />
      </PolymeshTheme>
    ),
  ],
} as ComponentMeta<typeof Button>;

const colorSchemes = ['navy', 'fucsia', 'pink', 'indigo'];
const sizes = ['sm', 'md', 'lg', 'xl'];

const ButtonRenderer = ({ variant }: { variant: 'solid' | 'outline' | 'ghost' }) => {
    return (
        <HStack gap="1rem" align="start">
          {colorSchemes.map((colorScheme) => (
            <Box key="colorScheme">
              <Heading mb="1rem" size="lg">
                Colorscheme: navy
              </Heading>
              <VStack alignItems="start">
                {sizes.map((size) => (
                  <Box key={size}>
                    <Heading mb="1rem" size="md">
                      size: {size}
                    </Heading>
                    <Button colorScheme={colorScheme} size={size} variant={variant}>
                      Button
                    </Button>
                  </Box>
                ))}
              </VStack>
            </Box>
          ))}
        </HStack>
      );
}

export const Solid = () => <ButtonRenderer variant="solid" />;

export const Outline = () => <ButtonRenderer variant="outline" />;

export const Ghost = () => <ButtonRenderer variant="ghost" />;

