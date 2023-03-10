import winston, { format, transports } from 'winston';
import { z } from 'zod';

const loggerSettingsZ = z
  .object({
    type: z.enum(['text', 'json']),
  })
  .describe('config needed for logging');

type LoggerSettings = ReturnType<typeof loggerSettingsZ.parse>;

const loggerSettings = (): LoggerSettings => {
  const rawSettings = {
    type: process.env.NODE_ENV === 'production' ? 'json' : 'text',
  };

  return loggerSettingsZ.parse(rawSettings);
};

class LoggerConfig {
  public settings: LoggerSettings = loggerSettings();
  private readonly options: winston.LoggerOptions;

  constructor() {
    this.options = {
      exitOnError: false,
      transports: [new transports.Console({ level: 'debug' })],
    };

    if (this.settings.type === 'text') {
      this.options.format = format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((msg) => {
          const { timestamp, level, message, context, ...data } = msg;
          const contextMsg = context ? `[${context}]` : '';
          const dataMsg = Object.entries(data).length
            ? ` - ${JSON.stringify(data)}`
            : '';

          return `${timestamp} ${contextMsg}[${level}] - ${message} ${dataMsg}`;
        })
      );
    } else {
      this.options.format = format.combine(format.timestamp(), format.json());
    }
  }

  /**
   *  write to stdout
   */
  public console(): winston.LoggerOptions {
    return this.options;
  }
}

/**
 * Configuration settings for logging - inferred from NODE_ENV
 */
export const loggerConfig = new LoggerConfig();
