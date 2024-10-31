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
    customer: string;

    @Prop({default: null})
    orderUse: string;

    @Prop()
    usedTime: Date;

    @Prop( {default: "https://m.media-amazon.com/images/I/41EZgyu05hL._AC_UF1000,1000_QL80_.jpg"})
    image: string;
}

export const CouponItemSchema = SchemaFactory.createForClass(CouponItem);
