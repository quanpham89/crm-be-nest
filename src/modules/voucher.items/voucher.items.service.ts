import { Injectable } from '@nestjs/common';
import { CreateVoucherItemDto } from './dto/create-voucher.item.dto';
import { UpdateVoucherItemDto } from './dto/update-voucher.item.dto';
import { VoucherItem } from './schemas/voucher.item.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VoucherItemsService {
  constructor(
    @InjectModel(VoucherItem.name) private VoucherItemsModal: Model<VoucherItem>,
  ){}

  create(createVoucherItemDto: CreateVoucherItemDto) {
    return 'This action adds a new menuItem';
  }

  async getAllVoucherItems () {
      const voucherItems = await this.VoucherItemsModal.find({status: "PUBLIC"})
      
    
      return voucherItems;
  }

  findAll() {
    return `This action returns all menuItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  update(id: number, UpdateVoucherItemDto: CreateVoucherItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
