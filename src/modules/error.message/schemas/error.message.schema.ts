import { Customer } from '@/modules/customer/schemas/customers.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type ErrorMessageDocument = HydratedDocument<ErrorMessage>;

@Schema({ timestamps: true })
export class ErrorMessage {

    @Prop({ref: "User"})
    userId: string;

    @Prop()
    description: string;

    @Prop()
    role: string;

    @Prop({ default: "PENDING"})
    status: string;
}

export const ErrorMessageSchema = SchemaFactory.createForClass(ErrorMessage);
