'use strict';

import os from 'node:os';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Logger } from 'winston';
import { z } from 'zod';

const telemetryZ = z
  .object({
    telemetry: z
      .object({
        hostname: z.string().default(os.hostname()),
        url: z.string().url().default(''),
        service: z.string().default('PolymeshCdd'),
      })
      .optional(),
  })
  .describe('config for telemetry data');

type TelemetryConfig = ReturnType<typeof telemetryZ.parse>;

const telemetryEnvConfig = (): TelemetryConfig => {
  const rawConfig = {
    url: process.env.OTLP_EXPORT_URL,
    hostname: process.env.OTLP_HOSTNAME,
    service: process.env.OTLP_SERVICE,
  };

  return telemetryZ.parse(rawConfig);
};

/**
 * starts telemetry service if env `OTLP_EXPORT_URL` is set
 */
export const startTelemetry = (logger: Logger) => {
  const { telemetry } = telemetryEnvConfig();

  if (!telemetry) {
    logger.info(
      'OTLP_EXPORT_URL was unset - open telemetry export was not started'
    );

    return;
  }

  const traceExporter = new OTLPTraceExporter(telemetry);
  const openTelemetrySdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: telemetry.service,
    }),
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  openTelemetrySdk
    .start()
    .then(() => logger.info('Open telemetry export started', telemetry))
    .catch((error) => logger.error('Error initializing tracing', error));

  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    openTelemetrySdk
      ?.shutdown()
      .then(() => logger.info('Open telemetry export terminated'))
      .catch((error) =>
        logger.error('Error terminating open telemetry export', error)
      )
      .finally(() => process.exit(0));
  });
};
