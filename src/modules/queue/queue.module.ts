// modules/queue/queue.module.ts
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './processor/email.processor';
import { ReportProcessor } from './processor/report.processor';
import { InventoryProcessor } from './processor/inventory.processor';
import { InvoiceProcessor } from './processor/invoice.processor';
import { QUEUE_NAMES } from './queue.constants';



@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.EMAIL },
      { name: QUEUE_NAMES.REPORT },
      { name: QUEUE_NAMES.NOTIFICATION },
      { name: QUEUE_NAMES.INVENTORY },
      { name: QUEUE_NAMES.INVOICE },
    ),
  ],
  providers: [QueueService, EmailProcessor, ReportProcessor, InventoryProcessor, InvoiceProcessor],
  exports: [QueueService],
})
export class QueueModule {}