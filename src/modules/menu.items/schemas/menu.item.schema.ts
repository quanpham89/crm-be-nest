import { Menu } from '@/modules/menus/schemas/menu.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({ timestamps: true })
export class MenuItem {

    @Prop()
    nameItemMenu: string;
    
    @Prop()
    description: string;

    @Prop()
    sellingPrice: number;

    @Prop()
    fixedPrice: number;

    @Prop({default:"https://t3.ftcdn.net/jpg/04/84/88/76/360_F_484887682_Mx57wpHG4lKrPAG0y7Q8Q7bJ952J3TTO.jpg"} )
    image: string;

    @Prop()
    menuId: string;

    @Prop()
    nameMenu: string;

    @Prop()
    deleteUrl: string;
    
    @Prop({default: "PUBLIC"})
    status: string

}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
