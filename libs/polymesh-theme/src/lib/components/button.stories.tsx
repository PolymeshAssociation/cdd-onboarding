import { Button, VStack } from '@chakra-ui/react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { PolymeshTheme } from '../theme-provider';


export default {
  title: 'Button',
  component: Button,  
  decorators: [
    (Story) => (
      <PolymeshTheme>
        <Story/>
      </PolymeshTheme>
    ),
  ],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
};


export const Secondary =  () => {
  return (
      <VStack bg="fucsia.100">
        <Button colorScheme="navy" size="xl">Button</Button>
      </VStack>
  )
}