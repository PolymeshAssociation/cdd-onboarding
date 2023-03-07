import { Box, Input, Text } from '@chakra-ui/react';
import { PolymeshTheme } from '../../../ThemeProvider';
import { useForm } from 'react-hook-form';
import {
  StepForm as StepFormComponent,
  Step,
  StepProps,
  FormContext,
} from './StepForm';
import { useContext } from 'react';

export default {
  title: 'organisms/StepForm',
  parameters: {
    layout: 'fullscreen',
  },
};

const FirstStep: React.FC<Pick<StepProps, 'index'>> = ({ index }) => {
  const { handleSubmit } = useForm();
  const { onNext } = useContext(FormContext);

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
        <Step title="First Step" nextStepLabel="Get Started" showFormNavigation>
          <FirstStep />
        </Step>
        <Step title="Second Step">test</Step>
        <Step title="Third Step">test</Step>
      </StepFormComponent>
    </PolymeshTheme>
  );
};
