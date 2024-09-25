import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateVoucherItemDto } from './dto/create-voucher.item.dto';
import { UpdateVoucherItemDto } from './dto/update-voucher.item.dto';
import { VoucherItemsService } from './voucher.items.service';
@Controller('voucher-items')
export class VoucherItemsController {
  constructor(private readonly voucherItemsService: VoucherItemsService) { }

  @Post()
  create(@Body() createVoucherItemDto: CreateVoucherItemDto) {
    return this.voucherItemsService.create(createVoucherItemDto);
  }

  @Get()
  findAll() {
    return this.voucherItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherItemDto: UpdateVoucherItemDto) {
    return this.voucherItemsService.update(+id, updateVoucherItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherItemsService.remove(+id);
  }
}
