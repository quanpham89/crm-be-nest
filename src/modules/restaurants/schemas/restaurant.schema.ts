
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
    @Prop()
    name: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    rating:number;

    @Prop()
    description: string;

    @Prop({default: null})
    userId: string;

    @Prop({default: null})
    menuId: string;

    @Prop({default: true})
    isShow: boolean

    @Prop({default: null})
    image: string

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
