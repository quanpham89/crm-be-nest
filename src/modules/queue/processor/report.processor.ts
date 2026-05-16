import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
} from '@nestjs/bullmq';

import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('report')
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(
    ReportProcessor.name,
  );

  async process(job: Job) {
    try {
      switch (job.name) {
        case 'generate-report':
          await job.log('🚀 Starting job');

          await job.updateProgress(20);

          await this.delay(1000);

          await job.log('📊 Processing data');

          await job.updateProgress(60);

          await this.delay(1000);

          await job.log('✅ Finalizing');

          await job.updateProgress(100);

          return {
            success: true,
          };
        default:
          throw new Error(
            `Unknown job type: ${job.name}`,
          );
      }

    } catch (error) {
      await job.log(
        `❌ ${error}`,
      );

      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `✅ Job ${job.id} completed`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(
      `❌ Job ${job?.id} failed`,
      err.stack,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(
      `⚙️ Job ${job.id} is now active`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number) {
    this.logger.log(
      `📈 Job ${job.id} progress: ${progress}%`,
    );
  }

  private async delay(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms),
    );
  }
}