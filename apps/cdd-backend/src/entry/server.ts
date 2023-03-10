import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ServerModule } from './server.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { json } from 'express';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { loggerConfig } from '../config/logger';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

async function bootstrap() {
  const logger = createLogger(loggerConfig.console());

  const app = await NestFactory.create(ServerModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  app.use(json({ limit: '1mb' })); // netki webhooks can be larger than the default `100kb`

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const config = app.get(ConfigService);

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

  const port = config.getOrThrow('server.port');
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${routePrefix}`
  );
}

bootstrap();
