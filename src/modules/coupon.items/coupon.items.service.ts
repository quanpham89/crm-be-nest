import { Injectable } from '@nestjs/common';
import { CreateCouponItemDto } from './dto/create-coupon.item.dto';
import { UpdateCouponItemDto } from './dto/update-coupon.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CouponItem } from './schemas/coupon.item.schema';
import { Model } from 'mongoose';

@Injectable()
export class CouponItemsService {
  constructor(
    @InjectModel(CouponItem.name) private CouponItemsModal: Model<CouponItem>,
  ){}
  create(createCouponItemDto: CreateCouponItemDto) {
    return 'This action adds a new couponItem';
  }

  async getAllCouponItem() {
    const couponItems = await this.CouponItemsModal.find({status: "PUBLIC"})
    return couponItems;
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
