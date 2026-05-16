// modules/queue/processors/email.processor.ts
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../queue.constants';
import { MailerService } from '@nestjs-modules/mailer';

@Processor(QUEUE_NAMES.EMAIL, {
  concurrency: 5,
})
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(
    EmailProcessor.name,
  );

  constructor(
    private readonly mailerService: MailerService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'send-email':
        return this.handleSendEmail(job);

      default:
        throw new Error(
          `Unknown job name: ${job.name}`,
        );
    }
  }

  private async handleSendEmail(job: Job) {
    try {

      const { data } = job.data;
      return await this.mailerService.sendMail({
        to: data?.to, // list of receivers
        subject:  data?.subject, // Subject line
        text:   data?.text, // plain text body
        template: data?.template, // name of the template file i.e email.hbs
        context: {
         ...data?.context,
        },
      })
        .then(async () => { await job.log(`✅ Email sent to ${data?.to}`); })
        .catch(async () => { await job.log(`❌ Failed to send email to ${data?.to}`); });
    } catch (error) {
      await job.log(
        `❌ ${error}`,
      );
    }


  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed: ${error.message}`,
    );
  }
}