// modules/queue/queue.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from './queue.constants';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue,
    @InjectQueue(QUEUE_NAMES.REPORT) private reportQueue: Queue,
    @InjectQueue(QUEUE_NAMES.INVENTORY) private inventoryQueue: Queue,
    @InjectQueue(QUEUE_NAMES.INVOICE) private invoiceQueue: Queue,
  ) {}

  async testReport() {
    return this.reportQueue.add('generate-report', {
      reportId: 'RPT-001',
      type: 'daily-sales',
      requestedAt: new Date().toISOString(),
      filters: {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      },
    });
  }

  async sendEmail(payload: any) {
    return this.emailQueue.add('send-email', payload, {
      priority: 1,
    });
  }

  async scheduleEmail(payload: any, delayMs: number) {
    return this.emailQueue.add('send-email', payload, {
      delay: delayMs,
      priority: 2,
    });
  }

  async generateDailyReport(payload: any) {
    return this.reportQueue.add('generate-report', payload, {
      repeat: { every: 24 * 60 * 60 * 1000 },
    });
  }

  async enqueueInventoryUpdate(payload: any) {
    return this.inventoryQueue.add('inventory-update', payload, {
      priority: 2,
      removeOnComplete: 50,
      attempts: 2,
    });
  }

  async enqueueInvoiceGeneration(payload: any) {
    return this.invoiceQueue.add('generate-invoice', payload, {
      priority: 1,
      removeOnComplete: 50,
      attempts: 3,
    });
  }
}
