
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
    @Prop({ ref: "Order" })
    order: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" })
    menuItem: mongoose.Schema.Types.ObjectId;


    @Prop({ ref: "MenuItem" })   
    nameItemMenu: string

    @Prop({ ref: "Restaurant" })
    restaurant: string;

    @Prop({ ref: "Restaurant" })
    restaurantName: string;

    @Prop({default: NaN})
    sellingPrice: number;

    @Prop({  ref: "Menu" })
    menu: string;

    @Prop({  ref: "Menu" })
    nameMenu: string

    @Prop()
    amount: number

    @Prop({ ref: "Customer" })
    customer: string;

    @Prop()
    orderTime: Date;

    @Prop()
    predictionTime: Date

    @Prop()
    paymentForm: string;

    @Prop({default: "PENDING"})
    status: string;


    @Prop({  ref: "Review", default: undefined })
    review: string[];

}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
