// import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';

export type MenuDocument = HydratedDocument<Menu>;

@Schema({ timestamps: true })
export class Menu {
    @Prop({ ref: Restaurant.name })
    restaurantId: string;

    @Prop()
    userCreateId: string;

    @Prop()
    nameMenu: string;

    @Prop({default: "PUBLIC"})
    status: string;

    @Prop()
    description: string;

    @Prop()
    createdBy:string;

    @Prop({ type:[mongoose.Schema.Types.ObjectId], ref: MenuItem.name })
    menuItemId: mongoose.Schema.Types.ObjectId[];

    @Prop({default: "https://cdn.dealtoday.vn/img/s630x420/f425c5ee26924b729fd75889a97c52ca.jpg?sign=yDXfvZBiRSPZILRXHRrm_A"})
    image: string;

}

export const MenuSchema = SchemaFactory.createForClass(Menu);
