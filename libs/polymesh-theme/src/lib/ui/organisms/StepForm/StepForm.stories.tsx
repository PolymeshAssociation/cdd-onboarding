import { Box, Input, Text } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';
import { useForm } from 'react-hook-form';
import {
  StepForm as StepFormComponent,
  StepFormStep,
  StepFormContext,
} from './index';
import { useContext } from 'react';

export default {
  title: 'organisms/StepForm',
  parameters: {
    layout: 'fullscreen',
  },
};

const FirstStep: React.FC = () => {
  const { handleSubmit } = useForm();
  const { onNext } = useContext(StepFormContext);

  const onSubmit = (data: unknown) => {
    console.log(data);
    onNext();
  };

  return (
    <form id="stepForm" onSubmit={handleSubmit(onSubmit)}>
      <Box maxW="500px">
        <Text mb="0.5rem" fontSize="sm">
          Polymesh Address
        </Text>
        <Input placeholder="Polymesh Address" size="lg" />
      </Box>
    </form>
  );
};

export const StepForm: React.FC = () => {
  return (
    <PolymeshTheme>
      <StepFormComponent title="Onboarding">
        <StepFormStep title="First Step" nextStepLabel="Get Started" showFormNavigation>
          <FirstStep />
        </StepFormStep>
        <StepFormStep title="Second Step">test</StepFormStep>
        <StepFormStep title="Third Step">test</StepFormStep>
      </StepFormComponent>
    </PolymeshTheme>
  );
};
