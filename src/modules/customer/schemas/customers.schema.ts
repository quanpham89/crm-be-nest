
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Review } from '@/modules/reviews/schemas/review.schema';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Coupon } from '@/modules/coupons/schemas/coupon.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
    menuItem: string[];
    
    @Prop()
    restaurantId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Review.name })
    review: string;

    @Prop({  ref: Voucher.name })
    voucher: string[];

    @Prop({  ref: Coupon.name })
    coupon: string[];

    @Prop({  ref: Voucher.name })
    voucherUse: string[];

    @Prop({  ref: Coupon.name })
    couponUse: string[];


}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
