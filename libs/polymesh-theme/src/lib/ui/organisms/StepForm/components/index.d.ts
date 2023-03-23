export type StepProps = {
    title: string;
    subTitle?: string;
    children: React.ReactNode;
    index?: number;
    nextStepLabel?: React.ReactNode;
    showFormNavigation?: boolean;
    nextLoadingLabel?: React.ReactNode;
    nextIsLoading?: boolean;
    nextIsDisabled?: boolean;
    nextIsError?: boolean;
    onNext?: () => void;
  };

  export type FromContextValue = {
    activeStep: number;
    setActiveStep: (step: number) => void;
    steps: Array<Pick<StepProps, 'title'>>;
    addStep: (step: Pick<StepProps, 'title'>) => void;
    onNext: () => void;
    onBack: () => void;
  };