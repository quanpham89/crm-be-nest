import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue.constants';

@Processor(QUEUE_NAMES.INVOICE, {
  concurrency: 2,
})
export class InvoiceProcessor extends WorkerHost {
  private readonly logger = new Logger(InvoiceProcessor.name);

  async process(job: Job) {
    switch (job.name) {
      case 'generate-invoice':
        return this.handleInvoiceGeneration(job);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleInvoiceGeneration(job: Job) {
    try {
      const { invoiceId, orderId, amount, customer } = job.data;
      await job.log(`Generating invoice ${invoiceId || 'N/A'} for order ${orderId}`);
      // Placeholder: implement actual invoice generation and storage logic here
      await this.delay(700);
      await job.log(`Invoice generated for ${customer?.email ?? 'unknown customer'}`);
      return { success: true, invoiceId, orderId, amount };
    } catch (error) {
      await job.log(`❌ Invoice generation failed: ${error.message}`);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Invoice job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
