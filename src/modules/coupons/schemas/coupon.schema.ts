import { CouponItem } from "@/modules/coupon.items/schemas/coupon.item.schema";
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
      
    @Prop()
    nameCoupon: string;

    @Prop()
    description: string;

    @Prop()
    amount: number;

    @Prop()
    discount: number;
    
    @Prop()
    endedDate: Date;

    @Prop()
    startedDate: Date;

    @Prop( {default: "https://m.media-amazon.com/images/I/41EZgyu05hL._AC_UF1000,1000_QL80_.jpg"})
    image: string;

    @Prop({default: "ALL"})
    scope: string;

    @Prop({default: "HIDDEN"})
    status: string;

    @Prop({default: "ADMIN"})
    createdBy: string

    @Prop({ type:[mongoose.Schema.Types.ObjectId], ref: CouponItem.name })
    couponItemId: mongoose.Schema.Types.ObjectId[];

    @Prop({default : null})
    userCreateId: string;

    @Prop({default: undefined})
    userGetCouponId: string[]

    @Prop({default: undefined})
    restaurantId: string;

}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

