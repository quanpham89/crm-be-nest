// import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
// import { User } from '@/modules/users/schemas/user.schema';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Menu } from '@/modules/menus/schemas/menu.schema';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name })
    restaurantId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Menu.name })
    menuId: string[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: MenuItem.name })
    menuItemId: string[];

    @Prop({default: "PENDING"})
    status: string;

    @Prop()
    totalPrice: number;

    @Prop()
    orderTime: Date;

    @Prop()
    deliveryTime: string;

    @Prop()
    address: string;

    @Prop()
    paymentForm: string

}

export const OrderSchema = SchemaFactory.createForClass(Order);
