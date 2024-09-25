import { VouchersService } from './vouchers.service';
import { Module } from '@nestjs/common';
import { VouchersController } from './vouchers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { VoucherItem, VoucherItemSchema } from '../voucher.items/schemas/voucher.item.schema';

@Module({

  imports: [MongooseModule.forFeature([
    {name: Voucher.name, schema: VoucherSchema},
    {name: VoucherItem.name, schema: VoucherItemSchema}
])],

  controllers: [VouchersController],
  providers: [VouchersService],

})
export class VouchersModule {}
