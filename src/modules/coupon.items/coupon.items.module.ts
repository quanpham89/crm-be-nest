import { Module } from '@nestjs/common';
import { CouponItemsService } from './coupon.items.service';
import { CouponItemsController } from './coupon.items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponItem, CouponItemSchema } from './schemas/coupon.item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: CouponItem.name, schema: CouponItemSchema},
])],
  controllers: [CouponItemsController],
  providers: [CouponItemsService],
})
export class CouponItemsModule {}
