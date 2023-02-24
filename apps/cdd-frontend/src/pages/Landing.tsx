import React from 'react';

import { MainTemplate } from '@polymeshassociation/polymesh-theme/ui/templates';
import {
  Hero,
  QuestionsAnswers,
  QuestionItem,
} from '@polymeshassociation/polymesh-theme/ui/organisms';
import { LandingImage } from '@polymeshassociation/polymesh-theme/ui/atoms';
import { Box, Button, Flex, Link } from '@chakra-ui/react';

const questionsAnswers: QuestionItem[] = [
  {
    question: 'What is the onboarding process?',
    answer:
      'Polymesh onboarding consists of a series of identity checks that confirm users are who they say they are through our CDD providers, Fractal, Netki or Jumio. Users provide information and documentation confirming their identities through Fractal/Netki/Jumio and are given access once validated. This onboarding process is the backbone of Polymesh uID (unique identity), ensuring users have a single identity on the blockchain.',
  },
  {
    question: 'What is CDD and identity validation?',
    answer:
      'CDD stands for customer due diligence, the process by which a user validates their identity confirming they are who they say they are.',
  },
  {
    question:
      'Why does Polymesh require users to have their identities validated through CDD?',
    answer:
      'Identity validation ensures each Polymesh user is who they say they are and acts as the backbone to Polymesh uID. On Polymesh, users can have only a single unique identity (uID), which ensures they cannot subvert securities regulation with multiple profiles.',
  },
  {
    question: 'Why am I getting rejected during CDD?',
    answer: (
      <>
        The Polymesh CDD providers, Fractal, Netki and Jumio, have a
        multifaceted approach to identity validation. Learn more about the
        issues you might be facing with CDD onboarding through{' '}
        <Link href="https://help.fractal.id/support/home" isExternal>
          Fractal
        </Link>{' '}
        or{' '}
        <Link href="https://support.jumio.com/hc/en-us" isExternal>
          Jumio
        </Link>{' '}
        support.
      </>
    ),
  },
  {
    question: 'Where does my CDD data go?',
    answer: (
      <>
        Your CDD data is stored with whichever CDD provider that onboarded you
        onto Polymesh. Currently the three CDD providers for the Polymesh
        blockchain are Fractal, Netki and Jumio. All CDD providers are compliant
        with strict GDPR regulation and personal data is not stored for longer
        than necessary for the purpose it was collected and its deletion may be
        requested at any time. Learn more about{' '}
        <Link
          href="https://help.fractal.id/support/solutions/articles/76000049153-how-is-fractal-making-sure-my-data-is-protected-"
          isExternal
        >
          Fractal's
        </Link>{' '}
        and{' '}
        <Link
          href="https://www.jumio.com/compliance-regulations/gdpr-compliance/"
          isExternal
        >
          Jumio's
        </Link>{' '}
        data privacy policy
      </>
    ),
  },
  {
    question:
      'I want to become an operator and run a node on Polymesh. How do I onboard?',
    answer: (
      <>
        To learn more about becoming a node operator on Polymesh,{' '}
        <Link href="https://polymesh.network/node-operators" isExternal>
          contact us.
        </Link>
      </>
    ),
  },
  {
    question:
      'I run a business wishing to operate on Polymesh. How do I onboard?',
    answer: (
      <>
        To learn more about onboarding as a business to Polymesh,{' '}
        <Link href="https://polymesh.network/contact-us" isExternal>
          contact us.
        </Link>
      </>
    ),
  },
  {
    question: 'I want to stake POLYX. How do I onboard?',
    answer:
      'Simply follow the onboarding steps to be assigned an onchain identity which will allow you access to staking on Polymesh.',
  },
];

const LandingCta = () => {
  return (
    <Box>
      <Flex gap="1rem" mb="1rem">
        <Button colorScheme="navy" size="lg" as="a" href="/verification">
          New Application
        </Button>
        <Button
          colorScheme="navy"
          size="lg"
          variant="outline"
          bg="#fff"
          as="a"
          href="https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf?hl=__REACT_APP_WALLET_URL=https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf?hl__"
          target="_blank"
        >
          New Application
        </Button>
      </Flex>
      <Button colorScheme="navy" size="lg" variant="outline" bg="#fff" as="a" href="/login">
        View an existing application
      </Button>
    </Box>
  );
};

const Landing = () => {
  return (
    <MainTemplate>
      <LandingImage src="/assets/img/blocks.svg" alt="Blockchain image" />

      <Hero
        title="Welcome to Polymesh"
        subtitle="Before onboarding to Polymesh, please make sure you have the Polymesh Wallet installed."
        cta={<LandingCta />}
      />
      <QuestionsAnswers
        title="Frequently Asked Questions"
        items={questionsAnswers}
      />
    </MainTemplate>
  );
};

export default Landing;
