import { VoucherItem } from '@/modules/voucher.items/schemas/voucher.item.schema';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoucherDto, SearchVoucerDto } from './dto/create-voucher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from './schemas/voucher.schema';
import mongoose, { Model } from 'mongoose';
import dayjs from 'dayjs';
import {v4 as uuidv4} from "uuid"
import aqp from 'api-query-params';
import { User } from '../users/schemas/user.schema';
import _ from "lodash"
import { Restaurant } from '../restaurants/schemas/restaurant.schema';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name) private VoucherModal: Model<Voucher>,
    @InjectModel(VoucherItem.name) private VoucherItemsModal: Model<VoucherItem>,
    @InjectModel(User.name) private UserModal: Model<User>,
    @InjectModel(Restaurant.name) private RestaurantModal: Model<Restaurant>,

  ){}



  isNameExist = async (nameVoucher: String ) => {
    let isExist = await this.VoucherModal.exists({nameVoucher})
    return isExist ? true :false
  }

  async create(createVoucherDto: CreateVoucherDto) {
    const { nameVoucher, amount, description, type, forAge, status, endedDate, startedDate, userCreateId, createdBy, percentage, image} = createVoucherDto;
    const user = (await this.UserModal.findOne({_id: userCreateId}))

    const isExist = await this.isNameExist(nameVoucher);
    if (isExist) {
        throw new BadRequestException(`Tên ${nameVoucher} đã tồn tại. Vui lòng sử dụng tên khác.`);
    }

    if(user.restaurantId === null && user.role === "BUSINESSMAN"){
      throw new BadRequestException("Bạn cần tạo nhà hàng trước khi tạo voucher.")
    }

    const vouchers = await this.VoucherModal.create({
        nameVoucher, amount, description, type, forAge, status, endedDate, startedDate, userCreateId, createdBy, percentage, image, restaurantId: user.role === "ADMINS" || user.role === "ADMIN" ? undefined : user.restaurantId
    });

    // update listvoucherId for restaurant
    const listVoucherId = await this.RestaurantModal.findOne({_id: user.restaurantId})
    await this.RestaurantModal.updateOne(
      {_id: user.restaurantId},
      {voucherId : [...listVoucherId.voucherId, vouchers._id]}
    )

    let voucherItemIdArray = [];
    for (let i = 0; i < +amount; i++) {
        const codeId = uuidv4();
        const voucherItem = await this.VoucherItemsModal.create({
            status: "UNUSED",
            voucherId: vouchers._id,
            codeId,
            endedDate, startedDate,
            image
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

  async getAllVoucher(){
    const voucher = await this.VoucherModal.find({status: "PUBLIC", restaurantId: undefined})
    .populate({
      path: 'voucherItemId',
      select: '-updatedAt -createdAt -__v' 
    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedVoucher = voucher.map((item : any) => {
      const { voucherItemId, ...rest } = item.toObject(); 
      return {
          ...rest, 
          voucherItems: voucherItemId,
      };
    })
    return formattedVoucher
  }

  async getVoucherBelongRestaurant (_id: string) {
    if(!_id ){
      throw new BadRequestException(`Bạn cần có _id để thực hiện lấy dữ liệu`);
    }
    const voucher = await this.VoucherModal.find({restaurantId: _id})
    .populate({
      path: 'voucherItemId',
      select: '-updatedAt -createdAt -__v' 
    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedVoucher = voucher.map((item : any) => {
      const { voucherItemId, ...rest } = item.toObject(); 
      voucherItemId.startedDate = item.startedDate
      voucherItemId.endedDate = item.endedDate
      return {
          ...rest, 
          voucherItems: voucherItemId,
      };
    })
    return formattedVoucher
  }

  async getItemvoucherForVoucher(_id: string) {
    if(!_id ){
      throw new BadRequestException(`Bạn cần có _id để thực hiện lấy dữ liệu`);
    }
    const voucher = await this.VoucherModal.find({_id: _id})
    .populate({
      path: 'voucherItemId',
      select: '-updatedAt -createdAt -__v' 
    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedVoucher = voucher.map((item : any) => {
      const { voucherItemId, ...rest } = item.toObject(); 
      voucherItemId.startedDate = item.startedDate
      voucherItemId.endedDate = item.endedDate
      return {
          ...rest, 
          voucherItems: voucherItemId,
      };
    })
    return formattedVoucher
  }

  async getVoucherCreateByAdmin () {
    const voucher = await this.VoucherModal.find({restaurantId: undefined})
    .populate({
      path: 'voucherItemId',
      select: '_id',
    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedVoucher = voucher.map((item : any) => {
      const { voucherItemId, ...rest } = item.toObject(); 
      voucherItemId.startedDate = item.startedDate
      voucherItemId.endedDate = item.endedDate
      return {
          ...rest, 
          voucherItems: voucherItemId,
      };
    })
    return formattedVoucher
  }

  async searchVoucher (searchVoucher : SearchVoucerDto) {
    const {nameVoucher, _id, type, forAge, endedTime, startedTime, userCreateId} = searchVoucher
    if(!nameVoucher  && !_id  && !type && !forAge  && !endedTime && !startedTime ){
      throw new BadRequestException(`Bạn cần có ít nhất 1 giá trị để thực hiện tìm kiếm`);
    }
    const query: any = {};
    if (nameVoucher) query.nameVoucher = nameVoucher;
    if (_id) query._id = _id;
    if (type) query.type = type;
    if (forAge) query.forAge = forAge;
    if(userCreateId) query.userCreateId = userCreateId
    if(startedTime) {
      query.createdAt =  {
        $gte: new Date(startedTime),
        $lte: endedTime ? new Date(endedTime) : new Date(startedTime)
      }
    }
    const vouchers = await this.VoucherModal.find({...query})
    return {
      vouchers
    }
  }

  findAll() {
    return `This action returns all likes`;
  }

  async findVoucherPerPage (query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.VoucherModal.find(filter.belongTo !== "undefined" ? {userCreateId: filter.belongTo} : {})).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results : any= await this.VoucherModal
    .find( filter.belongTo !== "undefined" ? {userCreateId: filter.belongTo} : {})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .select("-password -updatedAt -codeExpired -codeId -createdAt -__v" ) 
    .populate({
      path: "voucherItemId",
      select : "_id codeId status itemUseId customerId"
    }).exec()

    const formattedResults = results.map((item : any) => {
      const { voucherItemId, ...rest } = item.toObject(); 
      return {
          ...rest, 
          voucherItems: voucherItemId
      };
  });
    return {results: formattedResults, totalItems, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  async update(updateVoucherDto : UpdateVoucherDto) {
    return await this.VoucherModal.updateOne({_id: updateVoucherDto._id }, {...updateVoucherDto})
  }

  async softDelete (_id : string) {
    return await this.VoucherModal.updateOne({_id: _id }, {status: "HIDDEN"})
  }

  async activeVoucher (_id : string) {
    return await this.VoucherModal.updateOne({_id: _id }, {status: "PUBLIC"})
  }

  async remove(_id: string) {
    if(
      mongoose.isValidObjectId(_id)){
        await this.VoucherItemsModal.deleteMany({voucherId: _id})
        return await this.VoucherModal.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  
  }
}


