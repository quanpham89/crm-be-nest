import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

    @Prop({default: "USER"})
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

}

export const UserSchema = SchemaFactory.createForClass(User);
