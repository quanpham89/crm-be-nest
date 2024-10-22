
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
    @Prop()
    restaurantName: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop({default: 10})
    rating:number;

    @Prop()
    description: string;

    @Prop()
    productType: string
    
    @Prop({default: true})
    isShow: boolean
    
    @Prop({default:"https://t3.ftcdn.net/jpg/04/84/88/76/360_F_484887682_Mx57wpHG4lKrPAG0y7Q8Q7bJ952J3TTO.jpg"})
    image: string
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    userId: string;
    
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Menu', default: [] })
    menuId: string[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Voucher', default: [] })
    voucherId: string[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Coupon', default: [] })
    couponId: string[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
