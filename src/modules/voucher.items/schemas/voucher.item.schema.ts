// import { Menu } from '@/modules/menus/schemas/menu.schema';

import { Voucher } from '@/modules/voucher/schemas/voucher.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VoucherItemDocument = HydratedDocument<VoucherItem>;

@Schema({ timestamps: true })
export class VoucherItem {
    
    @Prop({default: "USE"})
    status: string;
    
    @Prop()
    codeId: string;

    @Prop()
    codeExpired: Date;

    @Prop()
    itemUse_id: string;
    
    @Prop({default: null})
    voucherId: string;

    @Prop({default: null})
    customerId: string;

    @Prop({default: null})
    itemUserId: string;
}

export const VoucherItemSchema = SchemaFactory.createForClass(VoucherItem);
