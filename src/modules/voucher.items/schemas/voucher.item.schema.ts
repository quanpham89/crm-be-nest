// import { Menu } from '@/modules/menus/schemas/menu.schema';

import { Customer } from '@/modules/customer/schemas/customers.schema';
import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VoucherItemDocument = HydratedDocument<VoucherItem>;

@Schema({ timestamps: true })
export class VoucherItem {
    
    @Prop({default: "UNUSED"})
    status: string;
    
    @Prop()
    codeId: string;

    @Prop({default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMd52cHZLpJLth8HUZhqpnHiKXXNYQ5nFd-Q&s"})
    image: string;
    
    @Prop()
    startedDate: Date;

    @Prop()
    endedDate: Date;

    @Prop()
    usedTime: Date;

    @Prop({default: null})
    voucherId: string;

    @Prop({ ref: "Customer", default: null})
    customer: string;

    @Prop({default: null})
    orderUse: string;
}

export const VoucherItemSchema = SchemaFactory.createForClass(VoucherItem);
