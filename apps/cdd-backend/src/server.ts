import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ServerModule } from './entry-points/server.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { openTelemetrySdk, setTelemetryServiceName } from './telemetry';

import { urlencoded, json } from 'express';

async function bootstrap() {
  if (openTelemetrySdk) {
    setTelemetryServiceName('CddServer');
    await openTelemetrySdk.start();
  }

  const app = await NestFactory.create(ServerModule);

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  const config = app.get(ConfigService);
  const port = config.getOrThrow('server.port');
  const routePrefix = config.getOrThrow('server.routePrefix');
  if (routePrefix) {
    app.setGlobalPrefix(routePrefix);
  }

  if (process.env.NODE_ENV !== 'production') {
    const openApiConfig = new DocumentBuilder()
      .setTitle('Polymesh CDD Backend')
      .setDescription(
        'Backend for providing Polymesh Customer Due Diligence claims (CDD)'
      )
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, openApiConfig);
    SwaggerModule.setup('/', app, document);
  }

  app.enableCors({ origin: ['http://localhost:4200'] });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
