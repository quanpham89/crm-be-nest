// import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';

export type MenuDocument = HydratedDocument<Menu>;

@Schema({ timestamps: true })
export class Menu {
    @Prop()
    restaurantId:string;

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

    // @Prop({default: "https://t4.ftcdn.net/jpg/00/89/55/15/360_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg"})
    // image: string;

}

export const MenuSchema = SchemaFactory.createForClass(Menu);
