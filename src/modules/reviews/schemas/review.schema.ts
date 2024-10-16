
// import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
// import { User } from '@/modules/users/schemas/user.schema';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name })
    restaurant: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: MenuItem.name })
    menuItem: mongoose.Schema.Types.ObjectId;

    @Prop()
    rating: number;

    @Prop({default:"https://t3.ftcdn.net/jpg/04/84/88/76/360_F_484887682_Mx57wpHG4lKrPAG0y7Q8Q7bJ952J3TTO.jpg"})
    image: string;

    @Prop()
    comment: string;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);