import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';
import { Menu, MenuSchema } from '../menus/schemas/menu.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customers.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { OrderDetail, OrderDetailSchema } from '../order.detail/schemas/order.detail.schema';
import { Voucher, VoucherSchema } from '../voucher/schemas/voucher.schema';
import { VoucherItem, VoucherItemSchema } from '../voucher.items/schemas/voucher.item.schema';
import { Coupon, CouponSchema } from '../coupons/schemas/coupon.schema';
import { CouponItem, CouponItemSchema } from '../coupon.items/schemas/coupon.item.schema';
import { MenuItem, MenuItemSchema } from '../menu.items/schemas/menu.item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Customer.name, schema: CustomerSchema },
    { name: Restaurant.name, schema: RestaurantSchema },
    { name: Menu.name, schema: MenuSchema },
    { name: MenuItem.name, schema: MenuItemSchema },
    { name: Order.name, schema: OrderSchema },
    { name: OrderDetail.name, schema: OrderDetailSchema },
    { name: Voucher.name, schema: VoucherSchema },
    { name: VoucherItem.name, schema: VoucherItemSchema },
    { name: Coupon.name, schema: CouponSchema },
    { name: CouponItem.name, schema: CouponItemSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule { }
