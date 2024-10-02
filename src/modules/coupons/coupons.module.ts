import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { CouponItem, CouponItemSchema } from '../coupon.items/schemas/coupon.item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Coupon.name, schema: CouponSchema},
    {name: CouponItem.name, schema: CouponItemSchema},
])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
