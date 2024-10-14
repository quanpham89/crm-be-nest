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

    @Prop()
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

}

export const UserSchema = SchemaFactory.createForClass(User);
