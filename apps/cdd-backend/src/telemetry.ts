'use strict';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Logger } from '@nestjs/common';

const OTLP_EXPORTER_URL = process.env.OTLP_EXPORTER_URL || '';

let __serviceName = 'Cdd';
let logger = new Logger(__serviceName);

export const setTelemetryServiceName = (name: string): void => {
  __serviceName = `${name}Tracer`;
  logger = new Logger(__serviceName);
};

export let openTelemetrySdk: NodeSDK | undefined;

if (OTLP_EXPORTER_URL) {
  const exporterOptions = {
    url: OTLP_EXPORTER_URL,
  };

  const traceExporter = new OTLPTraceExporter(exporterOptions);
  openTelemetrySdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: __serviceName,
    }),
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  openTelemetrySdk
    .start()
    .then(() =>
      logger.log(`Trace data is being exported to '${OTLP_EXPORTER_URL}'`)
    )
    .catch((error) => logger.error('Error initializing tracing', error));

  // gracefully shut down the SDK on process exit
  process.on('SIGTERM', () => {
    openTelemetrySdk
      ?.shutdown()
      .then(() => logger.log('Tracing terminated'))
      .catch((error) => logger.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
}
