export type VerificationState = {
  email?: string;
  emailSubmitted?: boolean;
  termsAccepted?: boolean;
  newsletterAccepted?: boolean;
  devUpdatesAccepted?: boolean;
  address?: string;
  provider?: 'netki' | 'jumio' | 'fractal' | 'mock';
  link?: string;
};
