import { Injectable } from '@nestjs/common';
import { CreateCouponItemDto } from './dto/create-coupon.item.dto';
import { UpdateCouponItemDto } from './dto/update-coupon.item.dto';

@Injectable()
export class CouponItemsService {
  create(createCouponItemDto: CreateCouponItemDto) {
    return 'This action adds a new couponItem';
  }

  findAll() {
    return `This action returns all couponItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} couponItem`;
  }

  update(id: number, updateCouponItemDto: UpdateCouponItemDto) {
    return `This action updates a #${id} couponItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} couponItem`;
  }
}
