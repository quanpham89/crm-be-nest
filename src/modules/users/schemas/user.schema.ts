import { Coupon } from '@/modules/coupons/schemas/coupon.schema';
import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop({default:"https://t3.ftcdn.net/jpg/04/84/88/76/360_F_484887682_Mx57wpHG4lKrPAG0y7Q8Q7bJ952J3TTO.jpg"})
    image: string;

    @Prop({default: "CUSTOMER"})
    role: string;

    @Prop({default: "FREE"})
    accountType: string;

    @Prop({default: "false"})
    isActive: boolean;

    @Prop()
    codeId: string;

    @Prop()
    codeExpired: Date;

    @Prop({default: "MALE"})
    sex: string;
    
    @Prop()
    birthday: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null })
    restaurantId: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Voucher.name })
    voucher: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Coupon.name })
    coupon: mongoose.Schema.Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User);
