import config, { AppConfig } from '../config/constants';

/** Signature of a logging function */
export interface LogFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
  debug: LogFn;
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
const NO_OP: LogFn = (message?: unknown, ...optionalParams: unknown[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn = NO_OP;
  readonly debug: LogFn = NO_OP;
  readonly warn: LogFn = NO_OP;
  readonly error: LogFn = NO_OP;

  constructor(options?: { level?: AppConfig['LOG_LEVEL'] }) {
    const { level } = options || {};

    if (level === 'off') {
      return;
    }

    this.error = console.error.bind(console);

    if (level === 'error') {
      return;
    }

    
    this.warn = console.warn.bind(console);
    
    if (level === 'warn') {
      return;
    }

    this.warn = console.log.bind(console);

    if (level === 'log') {
      return;
    }

    this.debug = console.debug.bind(console);
  }
}

export const logger = new ConsoleLogger({ level: config.LOG_LEVEL });
