import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from './schemas/voucher.schema';
import { Model } from 'mongoose';
import { VoucherItem } from '../voucher.items/schemas/voucher.item.schema';
import dayjs from 'dayjs';
import {v4 as uuidv4} from "uuid"


@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name) private VoucherModal: Model<Voucher>,
    @InjectModel(VoucherItem.name) private VoucherItemsModal: Model<VoucherItem>,
  ){}



  isNameExist = async (nameVoucher: String ) => {
    let isExist = await this.VoucherModal.exists({nameVoucher})
    return isExist ? true :false
  }

  async create(createVoucherDto: CreateVoucherDto) {
    const { nameVoucher, amount, description, type, forAge, status } = createVoucherDto;

    const isExist = await this.isNameExist(nameVoucher);
    if (isExist) {
        throw new BadRequestException(`Tên ${nameVoucher} đã tồn tại. Vui lòng sử dụng tên khác.`);
    }

    const vouchers = await this.VoucherModal.create({
        nameVoucher, amount, description, type, forAge, status
    });

    let voucherItemIdArray = [];

    for (let i = 0; i < +amount; i++) {
        const codeId = uuidv4();
        const voucherItem = await this.VoucherItemsModal.create({
            status: "USED",
            voucherId: vouchers._id,
            codeId,
            codeExpired: dayjs().add(10, 'days'), // Set to 10 days if needed
        });
        voucherItemIdArray.push(voucherItem._id);
    }
    await this.VoucherModal.updateOne(
        { _id: vouchers._id },
        { voucherItemId: voucherItemIdArray }
    );

    return {
        _id: vouchers._id
    };
}

  async getItemvoucherForVoucher(_id: string) {
    const voucher = await this.VoucherModal.find({_id: _id}).populate('voucherItemId').exec(); 
    return voucher
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}


