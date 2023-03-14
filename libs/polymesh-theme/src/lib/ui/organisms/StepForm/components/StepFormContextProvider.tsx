import React from "react";

import { StepProps } from "./index.d";
import { StepFormContext } from "./StepFormContext";

const StepFormContextProvider = ({
    children,
    initialStep = 0,
  }: {
    children: React.ReactNode;
    initialStep?: number;
  }) => {
    const [activeStep, setActiveStep] = React.useState(initialStep);
    const [steps, setSteps] = React.useState<Pick<StepProps, 'title'>[]>([]);
  
    const onNext = () => {
      setActiveStep(activeStep + 1);
    };
  
    const onBack = () => {
      setActiveStep(activeStep - 1);
    };
  
    const addStep = (step: Pick<StepProps, 'title'>) => {
      setSteps((prev) => {
        if (prev.some((s) => s.title === step.title)) {
          return prev;
        }
  
        return [...prev, step];
      });
    };
  
    const api = { activeStep, setActiveStep, onNext, onBack, steps, addStep };
  
    return <StepFormContext.Provider value={api}>{children}</StepFormContext.Provider>;
  };

  export default StepFormContextProvider;