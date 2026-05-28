import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { ExpressAdapter } from '@bull-board/express/dist/ExpressAdapter';
import { createBullBoard } from '@bull-board/api';
import { QUEUE_NAMES } from './modules/queue/queue.constants';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq/dist/esm/classes/queue';
import { getQueueToken } from '@nestjs/bullmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/queues');

  createBullBoard({
    queues: [
      new BullMQAdapter(app.get<Queue>(getQueueToken(QUEUE_NAMES.EMAIL))),
      new BullMQAdapter(app.get<Queue>(getQueueToken(QUEUE_NAMES.REPORT))),
      new BullMQAdapter(app.get<Queue>(getQueueToken(QUEUE_NAMES.NOTIFICATION))),

    ],
    serverAdapter,
  });

  app.use('/queues', serverAdapter.getRouter());
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe({
    // Tự động loại bỏ những thông tin thừa (không có trong database) khi truyền từ fe sang
    whitelist : true,
    // Nếu trường thông tin không có database thì sẽ gửi thông báo không tồn tại trong db
    forbidNonWhitelisted: true
  }))
  app.setGlobalPrefix("api/v1", {
  exclude: ['', 'queues', 'queues/(.*)']
})
  //config cors
  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true
    }
    );
    // security and compression
    app.use(helmet());
    app.use(compression());

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    console.log(`Server is running on port ${port}`);
    
 await app.listen(port);
  }
bootstrap();
 