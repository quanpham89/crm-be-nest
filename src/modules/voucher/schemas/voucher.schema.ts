
import { VoucherItem } from '@/modules/voucher.items/schemas/voucher.item.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ timestamps: true })
export class Voucher {
    
    @Prop()
    nameVoucher: string;

    @Prop()
    description: string;

    @Prop()
    amount: number;

    @Prop()
    remain: number;

    @Prop()
    type: string;

    @Prop()
    endedDate: Date;

    @Prop()
    startedDate: Date;

    @Prop({default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMd52cHZLpJLth8HUZhqpnHiKXXNYQ5nFd-Q&s"})
    image: string;

    @Prop()
    percentage: number;

    @Prop({default: "ALL"})
    scope: string;

    @Prop({default: "HIDDEN"})
    status: string;


    @Prop({default: "ADMIN"})
    createdBy: string

    @Prop({ ref: VoucherItem.name })
    voucherItemId: string[];

    @Prop({default: undefined})
    userCreateId: string;

    @Prop({default: undefined})
    userGetVoucherId: string[];

    @Prop({default: undefined})
    restaurantId: string;


}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
