
import { MenuItem } from 'src/modules/menu.items/schemas/menu.item.schema';
import { Menu } from 'src/modules/menus/schemas/menu.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Coupon } from '@/modules/coupons/schemas/coupon.schema';
import { Review } from '@/modules/reviews/schemas/review.schema';
import { Order } from '@/modules/orders/schemas/order.schema';
import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { Customer } from '@/modules/customer/schemas/customers.schema';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Order" })
    order: mongoose.Schema.Types.ObjectId;

    @Prop({ ref: MenuItem.name })
    menuItem: string;


    @Prop({ ref: MenuItem.name })
    nameItemMenu: string

    @Prop({ ref: Restaurant.name })
    restaurant: string;

    @Prop({ ref: Restaurant.name })
    restaurantName: string;

    @Prop({default: NaN})
    sellingPrice: number;

    @Prop({  ref: Menu.name })
    menu: string;

    @Prop({  ref: Menu.name })
    nameMenu: string

    @Prop()
    amount: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Customer.name })
    customer: mongoose.Schema.Types.ObjectId;

    @Prop({  ref: Review.name, default: undefined })
    review: string[];

}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
