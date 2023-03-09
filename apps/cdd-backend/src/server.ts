import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ServerModule } from './entry-points/server.module';
import { openTelemetrySdk, setTelemetryServiceName } from './telemetry';

async function bootstrap() {
  if (openTelemetrySdk) {
    setTelemetryServiceName('CddServer');
    await openTelemetrySdk.start();
  }

  const app = await NestFactory.create(ServerModule);

  const openApiConfig = new DocumentBuilder()
    .setTitle('Polymesh CDD Backend')
    .setDescription(
      'Backend for providing Polymesh Customer Due Diligence claims (CDD)'
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('/', app, document);

  const config = app.get(ConfigService);
  const port = config.getOrThrow('port');

  app.enableCors({ origin: ['http://localhost:4200'] });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
