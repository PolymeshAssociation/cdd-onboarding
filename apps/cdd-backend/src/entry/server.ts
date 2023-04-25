import { NestFactory } from '@nestjs/core';

import { ServerModule } from './server.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { json } from 'express';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { loggerEnvConfig } from '../config/logger';
import { LoggingInterceptor } from '../common/logging.interceptor';
import { startTelemetry } from '../config/telemetry';

/**
 * start a server process
 */
async function bootstrap() {
  const logger = createLogger(loggerEnvConfig('CddServer'));
  startTelemetry(logger);

  const app = await NestFactory.create(ServerModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  const config = app.get(ConfigService);
  const routePrefix = config.getOrThrow('server.routePrefix');
  const port = config.getOrThrow('server.port');

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.use(json({ limit: '1mb' })); // netki webhooks can be larger than the default `100kb`
  app.setGlobalPrefix(routePrefix);

  if (process.env.NODE_ENV !== 'production') {
    const documentationRoute = `${routePrefix}/docs`;
    logger.info('NODE_ENV was not `production` - serving swagger web UI', {
      documentationRoute,
    });
    const openApiConfig = new DocumentBuilder()
      .setTitle('Polymesh CDD Backend')
      .setDescription(
        'Backend for providing Polymesh Customer Due Diligence claims (CDD)'
      )
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, openApiConfig);
    SwaggerModule.setup(documentationRoute, app, document);
  }

  app.enableCors({ origin: ['http://localhost:4200']});

  await app.listen(port);
  logger.info(`Server is running on: http://localhost:${port}${routePrefix}`);
}

bootstrap();
