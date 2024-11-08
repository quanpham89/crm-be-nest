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

    @Prop({default:"https://cdn.dealtoday.vn/img/s630x420/f425c5ee26924b729fd75889a97c52ca.jpg?sign=yDXfvZBiRSPZILRXHRrm_A"} )
    image: string;

    @Prop()
    menuId: string;

    @Prop()
    nameMenu: string;

    @Prop()
    deleteUrl: string;
    
    @Prop({default: "PUBLIC"})
    status: string

    @Prop({default: 100})
    quantity: number;

    @Prop({default: 100})
    remain: number;


}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
