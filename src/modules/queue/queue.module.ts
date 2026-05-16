// modules/queue/queue.module.ts
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './processor/email.processor';
import { ReportProcessor } from './processor/report.processor';
import { QUEUE_NAMES } from './queue.constants';



@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.EMAIL },
      { name: QUEUE_NAMES.REPORT },
      { name: QUEUE_NAMES.NOTIFICATION },
    ),
  ],
  providers: [QueueService, EmailProcessor, ReportProcessor],
  exports: [QueueService],
})
export class QueueModule {}