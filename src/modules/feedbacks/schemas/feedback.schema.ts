// import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { Order } from '@/modules/orders/schemas/order.schema';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" })
    restaurantId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User"})
    customerId: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" })
    menuItemId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Order" })
    orderId: mongoose.Schema.Types.ObjectId;

    @Prop({default: null})
    comment:string;

    @Prop({default: 5})
    rate:number;

          

}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
