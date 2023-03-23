import { hostname } from 'os';
import winston, { format, transports } from 'winston';
import { z } from 'zod';

const loggerSettingsZ = z
  .object({
    type: z.enum(['text', 'json']),
  })
  .describe(
    `the format the log will be written in:
    'text' will destructure and colorize common JSON properties for a better developer experience
    'json' will write a JSONL format for easy log ingestion`
  );

type LoggerSettings = ReturnType<typeof loggerSettingsZ.parse>;

const loggerEnvSettings = (): LoggerSettings => {
  const rawSettings = {
    type: process.env.NODE_ENV === 'production' ? 'json' : 'text',
  };

  return loggerSettingsZ.parse(rawSettings);
};

class LoggerConfig {
  public settings: LoggerSettings = loggerEnvSettings();
  private readonly options: winston.LoggerOptions;

  constructor(context: string) {
    this.options = {
      exitOnError: false,
      defaultMeta: { context },
      transports: [new transports.Console({ level: 'debug' })],
    };

    if (this.settings.type === 'text') {
      this.options.format = format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((msg) => {
          const { context, timestamp, level, message, ...extra } = msg;

          const extraInfo = Object.entries(extra).length
            ? `- ${JSON.stringify(extra)}`
            : '';

          return `${timestamp} [${level}] ${context} - ${message} ${extraInfo}`;
        })
      );
    } else {
      this.options.format = format.combine(
        format.timestamp(),
        format.label({ label: hostname() }),
        format.json({
          deterministic: true,
          maximumBreadth: 50,
          maximumDepth: 25,
        })
      );
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
export const loggerEnvConfig = (context: string): winston.LoggerOptions => {
  const config = new LoggerConfig(context);

  return config.console();
};
