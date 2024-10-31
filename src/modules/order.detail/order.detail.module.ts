import { Module } from '@nestjs/common';
import { OrderDetailService } from './order.detail.service';
import { OrderDetailController } from './order.detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetail, OrderDetailSchema } from './schemas/order.detail.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: OrderDetail.name, schema: OrderDetailSchema },
    { name: Order.name, schema: OrderSchema },

  ])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
})
export class OrderDetailModule {}
