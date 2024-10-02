import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CouponItemsService } from './coupon.items.service';
import { CreateCouponItemDto } from './dto/create-coupon.item.dto';
import { UpdateCouponItemDto } from './dto/update-coupon.item.dto';

@Controller('coupon.items')
export class CouponItemsController {
  constructor(private readonly couponItemsService: CouponItemsService) {}

  @Post()
  create(@Body() createCouponItemDto: CreateCouponItemDto) {
    return this.couponItemsService.create(createCouponItemDto);
  }

  @Get()
  findAll() {
    return this.couponItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponItemDto: UpdateCouponItemDto) {
    return this.couponItemsService.update(+id, updateCouponItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponItemsService.remove(+id);
  }
}
