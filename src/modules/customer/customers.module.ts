import { Module } from '@nestjs/common';
import { CustomersController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customers.schema';
import { CustomersService } from './customers.service';
import { Voucher, VoucherSchema } from '../voucher/schemas/voucher.schema';
import { Coupon, CouponSchema } from '../coupons/schemas/coupon.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Customer.name, schema: CustomerSchema },
    { name: Coupon.name, schema: CouponSchema },
    { name: Voucher.name, schema: VoucherSchema },

  ])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
