
import { MenuItem } from 'src/modules/menu.items/schemas/menu.item.schema';
import { Menu } from 'src/modules/menus/schemas/menu.schema';
import { Order } from 'src/modules/orders/schemas/order.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Coupon } from '@/modules/coupons/schemas/coupon.schema';
import { Review } from '@/modules/reviews/schemas/review.schema';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name })
    order: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Menu.name })
    menu: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
    menuItem: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Voucher.name })
    voucher: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Coupon.name })
    coupon: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Review.name })
    review: mongoose.Schema.Types.ObjectId;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
