// import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
// import { User } from '@/modules/users/schemas/user.schema';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Menu } from '@/modules/menus/schemas/menu.schema';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { Customer } from '@/modules/customer/schemas/customers.schema';
import { OrderDetail } from '@/modules/order.detail/schemas/order.detail.schema';
import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Coupon } from '@/modules/coupons/schemas/coupon.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Customer.name })
    customer: mongoose.Schema.Types.ObjectId;

    @Prop({default: "PENDING"})
    status: string;

    @Prop()
    totalPrice: number;

    @Prop()
    orderTime: Date;

    @Prop()
    predictionTime: Date;

    @Prop()
    receiveTime: Date;
   
    @Prop()
    paymentForm: string

    @Prop()
    totalWithoutDiscount: number
    
    @Prop()
    address: string;
    
    @Prop({  ref: OrderDetail.name })
    orderDetail: string[];
    
    @Prop({  ref: Voucher.name })
    voucher: string;

    @Prop({  ref: Coupon.name })
    coupon: string;
    
    
    
    
    

}

export const OrderSchema = SchemaFactory.createForClass(Order);
