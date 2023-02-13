import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ServerModule } from './entry-points/server.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

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

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
