import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderDetail, OrderDetailSchema } from '../order.detail/schemas/order.detail.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customers.schema';
import { Coupon, CouponSchema } from '../coupons/schemas/coupon.schema';
import { Voucher, VoucherSchema } from '../voucher/schemas/voucher.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: OrderDetail.name, schema: OrderDetailSchema },
    { name: Customer.name, schema: CustomerSchema },
    { name: Voucher.name, schema: VoucherSchema },
    { name: Coupon.name, schema: CouponSchema },



  ])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
