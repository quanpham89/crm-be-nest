
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { Review } from '@/modules/reviews/schemas/review.schema';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
    menuItem: string;
    
    @Prop()
    restaurantId: string;

    @Prop()
    voucherId: string;

    @Prop()
    couponId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Review.name })
    review: string;


}

export const CustomerSchema = SchemaFactory.createForClass(Customer);