import { Injectable, BadRequestException } from '@nestjs/common';
import { canTransition, ORDER_STATUSES } from '@/modules/orders/order-status.machine';

@Injectable()
export class OrderValidatorService {
  validateStatus(status: string) {
    if (!status) return;
    if (!ORDER_STATUSES.includes(status as any)) {
      throw new BadRequestException(`Invalid order status: ${status}`);
    }
  }

  validateTransition(currentStatus: string, nextStatus: string) {
    if (!currentStatus || !nextStatus) {
      throw new BadRequestException('Current status and next status are required.');
    }
    if (currentStatus === nextStatus) return;
    if (!canTransition(currentStatus, nextStatus)) {
      throw new BadRequestException(`Cannot transition order from ${currentStatus} to ${nextStatus}.`);
    }
  }
}
