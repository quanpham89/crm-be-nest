import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto, SearchCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './schemas/coupon.schema';
import mongoose, { Model } from 'mongoose';
import { CouponItem } from '../coupon.items/schemas/coupon.item.schema';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import {v4 as uuidv4} from "uuid"
import aqp from 'api-query-params';
import { User } from '../users/schemas/user.schema';
import _ from 'lodash';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name) private CouponModal: Model<Coupon>,
    @InjectModel(CouponItem.name) private CouponItemsModal: Model<CouponItem>,
    @InjectModel(User.name) private UserModal: Model<User>,
    @InjectModel(Restaurant.name) private RestaurantModal: Model<Restaurant>,

  ){}

  isNameExist = async (nameCoupon: String ) => {
    let isExist = await this.CouponModal.exists({nameCoupon})
    return isExist ? true :false
  }

  async create(createCouponDto: CreateCouponDto) {

    const { nameCoupon, amount, description, scope , status, endedDate, startedDate, userCreateId, createdBy, discount, image, type } = createCouponDto;
    const user = await this.UserModal.findOne({_id: userCreateId})

    const isExist = await this.isNameExist(nameCoupon);
    if (isExist) {
        throw new BadRequestException(`Tên ${nameCoupon} đã tồn tại. Vui lòng sử dụng tên khác.`);
    }
    if(user.restaurantId === null ){
      throw new BadRequestException("Bạn cần tạo nhà hàng trước khi tạo coupon.")
    }

    const coupons = await this.CouponModal.create({
      nameCoupon, type, amount, description, scope , status, endedDate, startedDate, userCreateId, createdBy, discount, image, restaurantId: user.role === "ADMINS" || user.role === "ADMIN" ? undefined : user.restaurantId, remain : amount
    });

    if(user.restaurantId  && user.role === "BUSINESSMAN"){
      // update listCouponId for restaurant
      const listCouponId = await this.RestaurantModal.findOne({_id: user.restaurantId})
      await this.RestaurantModal.updateOne(
        {_id: user.restaurantId},
        {couponId : [...listCouponId.couponId, coupons._id]}
      )
    }

    let couponItemIdArray = [];

    for (let i = 0; i < +amount; i++) {
        const codeId = uuidv4();
        const couponItem = await this.CouponItemsModal.create({
            status: "UNUSED",
            couponId: coupons._id,
            codeId,
            endedDate, startedDate,
            image
        });
        couponItemIdArray.push(couponItem._id);
    }
    await this.CouponModal.updateOne(
        { _id: coupons._id },
        { couponItemId: couponItemIdArray }
    );

    return {
        _id: coupons._id
    };
  }

  async findCouponPerPage (query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.CouponModal.find(filter.belongTo !== "undefined" ? {userCreateId: filter.belongTo} : {})).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results : any= await this.CouponModal
    .find(  filter.belongTo !== "undefined" ? {userCreateId: filter.belongTo} : {})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .select("-password -updatedAt -codeExpired -codeId -createdAt -__v" ) 
    .populate({
      path: "couponItemId",
      select : "_id codeId status itemUseId customerId"
    }).exec()

    const formattedResults = results.map((item : any) => {
      const { couponItemId, ...rest } = item.toObject(); 
      return {
          ...rest, 
          couponItems: couponItemId
      };
  });
    return {results: formattedResults, totalItems, totalPages};
  }

  async getCouponBelongToRestaurant (_id: string) {
    if(!_id ){
      throw new BadRequestException(`Bạn cần có _id để thực hiện lấy dữ liệu.`);
    }
    const coupon = await this.CouponModal.find({restaurantId: _id})
    .populate({
      path: 'couponItemId',
      select: '-updatedAt -createdAt -__v',
    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedCoupon = coupon.map((item : any) => {
      const { couponItemId, ...rest } = item.toObject(); 
      couponItemId.startedDate = item.startedDate
      couponItemId.endedDate = item.endedDate
      return {
          ...rest, 
          couponItems: couponItemId,
      };
    })
    return formattedCoupon
  }

  async getAllCoupon(){
    const coupon = await this.CouponModal.find({status: "PUBLIC", restaurantId: undefined})
    .populate({
      path: 'couponItemId',
      select: '-updatedAt -createdAt -__v' 
    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedCoupon = coupon.map((item : any) => {
      const { couponItemId, ...rest } = item.toObject(); 
      return {
          ...rest, 
          couponItems: couponItemId,
      };
    })
    return formattedCoupon
  }

  async getItemCouponForCoupon(_id: string) {
    if(!_id ){
      throw new BadRequestException(`Bạn cần có id để thực hiện lấy dữ liệu`);
    }
    const coupon = await this.CouponModal.find({_id: _id})
    .populate({
      path: 'couponItemId',
      select: '-updatedAt -createdAt -__v',
      populate: ({
        path:"customer",
        select: "userId",
        populate :({
          path: "userId",
          select: "name"
        })
      } )

    })
    .select('-updatedAt -createdAt -__v')
    .exec();
    const formattedCoupon = coupon.map((item : any) => {
      const { couponItemId, ...rest } = item.toObject(); 
      couponItemId.startedDate = item.startedDate
      couponItemId.endedDate = item.endedDate
      return {
          ...rest, 
          couponItems: couponItemId,
      };
    })
    return formattedCoupon
  }

  async searchCoupon (searchCoupon : any) {
    const {nameCoupon, _id, scope, discount, endedTime, startedTime, belongTo} = searchCoupon
    if(!nameCoupon  && !_id  && !scope && !discount  && !endedTime && !startedTime ){
      throw new BadRequestException(`Bạn cần có ít nhất 1 giá trị để thực hiện tìm kiếm`);
    }
    const query: any = {};
    if (nameCoupon) query.nameCoupon = nameCoupon;
    if (_id) query._id = _id;
    if (scope) query.scope = scope;
    if (discount) query.discount = discount;
    if(belongTo) query.userCreateId = belongTo

    if(startedTime) {
      query.createdAt =  {
        $gte: new Date(startedTime),
        $lte: endedTime ? new Date(endedTime) : new Date(startedTime)
      }
    }
    const coupons = await this.CouponModal.find({...query})
    return {
      coupons
    }
  }

  async softDelete (_id : string) {
    return await this.CouponModal.updateOne({_id: _id }, {status: "HIDDEN"})
  }

  findAll() {
    return `This action returns all coupons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  async update(updateCouponDto: UpdateCouponDto) {
    return await this.CouponModal.updateOne({_id: updateCouponDto._id }, {...updateCouponDto})
  }

  async activeCoupon (_id : string) {
    return await this.CouponModal.updateOne({_id: _id }, {status: "PUBLIC"})
  }

  async remove(_id: string) {
    if(
      mongoose.isValidObjectId(_id)){
        await this.CouponItemsModal.deleteMany({couponId: _id})
        return await this.CouponModal.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  
  }
}
