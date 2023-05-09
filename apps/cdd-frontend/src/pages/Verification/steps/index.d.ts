export type VerificationState = {
    email?: string,
    emailSubmitted?: boolean,
    termsAccepted?: boolean,
    updatesAccepted?: boolean,
    address?: string,
    provider?: 'netki' | 'jumio',
    link?: string
  }