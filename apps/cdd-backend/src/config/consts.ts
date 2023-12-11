import Bull from 'bull';

export const bullJobOptions: Bull.JobOptions = {
  backoff: {
    type: 'exponential',
    delay: 5 * 60 * 1000,
  },
  attempts: 5,
};
