import { Module } from '@nestjs/common';
import { VoucherItemsService } from './voucher.items.service';
import { VoucherItemsController } from './voucher.items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherItem, VoucherItemSchema } from './schemas/voucher.item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    
    {name: VoucherItem.name, schema: VoucherItemSchema}
])],
  controllers: [VoucherItemsController],
  providers: [VoucherItemsService],
})
export class VoucherItemsModule {}
