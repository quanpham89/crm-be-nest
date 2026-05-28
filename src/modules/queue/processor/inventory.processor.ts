import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue.constants';

@Processor(QUEUE_NAMES.INVENTORY, {
  concurrency: 3,
})
export class InventoryProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryProcessor.name);

  async process(job: Job) {
    switch (job.name) {
      case 'inventory-update':
        return this.handleInventoryUpdate(job);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleInventoryUpdate(job: Job) {
    try {
      const { items, source } = job.data;
      await job.log(`Starting inventory update for ${items?.length ?? 0} items`);
      // Placeholder: implement actual inventory logic here
      await this.delay(500);
      await job.log(`Inventory updated from source: ${source ?? 'unknown'}`);
      return { success: true, processed: items?.length ?? 0 };
    } catch (error) {
      await job.log(`❌ Inventory update failed: ${error.message}`);
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
