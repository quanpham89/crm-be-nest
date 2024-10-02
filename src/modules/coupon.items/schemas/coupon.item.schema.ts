import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type CouponItemDocument = HydratedDocument<CouponItem>;

@Schema({ timestamps: true })
export class CouponItem {
      
    @Prop({default: "UNUSED"})
    status: string;
    
    @Prop()
    codeId: string;
    
    @Prop()
    startedDate: Date;

    @Prop()
    endedDate: Date;

    @Prop({default: null})
    couponId: string;

    @Prop({default: null})
    customerId: string;

    @Prop({default: null})
    itemUseId: string;

    @Prop()
    usedTime: Date;
}

export const CouponItemSchema = SchemaFactory.createForClass(CouponItem);
