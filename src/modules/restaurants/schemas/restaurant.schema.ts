
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
    
    @Prop({default: null})
    image: string
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    userId: string;
    
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Menu', default: null })
    menuId: string[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
