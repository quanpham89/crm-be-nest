import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customers.schema';
import { Model } from 'mongoose';
import { Coupon } from '../coupons/schemas/coupon.schema';
import { Voucher } from '../voucher/schemas/voucher.schema';

@Injectable()
export class CustomersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    @InjectModel(Coupon.name) private CouponModel: Model<Coupon>,
    @InjectModel(Voucher.name) private VoucherModel: Model<Voucher>,



   ){}
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new menuItemOption';
  }

  async findAll() {
   return ""
  }

  async getCustomerByUserId(_id: string) {
    if(!_id){
      throw new BadRequestException ("Không xác định được _id.")
    }else{
      const customer = await this.CustomerModel.findOne({userId: _id})
      .populate({
        path: "userId",
        select: "name email role accountType sex image isActive phone address" 
      })
      .populate({
        path: "voucher",
        select: "-createdAt -updatedAt -__v -createdBy -status -image -forAge"
      })
      .populate({
        path: "coupon",
        select: "-createdAt -updatedAt -__v -createdBy -image -status"
      })
      .select("-createdAt -updatedAt -__v")
      .exec()
      return customer
    }
  }

  async findOne(_id: string) {
    if(!_id){
      throw new BadRequestException ("Không xác định được _id.")
    }else{
      const customer = await this.CustomerModel.findOne({userId: _id})
      .populate({
        path: "userId",
        select: "name email role accountType sex image isActive phone address"
      })
      .select("-createdAt -updatedAt -__v")
      .exec()
      const data = { _id: customer._id, user: customer.userId }; 
      
      return data
    }
    
  }

  async getVoucherCreateByAdmin (_id : string) {
    if(!_id){
      throw new BadRequestException ("Không xác định được _id.")
    }else{
      const vouchers = await this.CustomerModel.find({userId: _id})
      .populate({
        path: "voucher",
        match: {restaurantId: undefined},
        select: "-createdAt -updatedAt -__v",
        populate: ({
          path: "voucherItemId",
          match: {status: "UNUSED"},
          select: "-createdAt -updatedAt -__v",
        })
      })
      .select("-createdAt -updatedAt -coupon -__v")
      .exec()
      return vouchers
    }
  }

  async getCouponCreateByAdmin (_id : string) {
    if(!_id){
      throw new BadRequestException ("Không xác định được _id.")
    }else{
      const customer = await this.CustomerModel.find({userId: _id})
      .populate({
        path: "coupon",
        match: {restaurantId: undefined},
        select: "-createdAt -updatedAt -__v",
        populate: ({
          path: "couponItemId",
          match: {status: "UNUSED"},
          select: "-createdAt -updatedAt -__v",
        })
      })
      .select("-createdAt -updatedAt -voucher -__v")
      .exec()
      return customer
    }
  }

  async addVoucherForCustomer (data : any) {
    if(!data || !data.userId){
      throw new BadRequestException ("Không xác định được khách hàng, vui lòng kiểm tra lại userId.")
    }
    const users = await this.CustomerModel.findOne({userId: data.userId})
    let listVoucher = users.voucher
    // check voucher đã được thêm chưa
    if(listVoucher.length > 0 && listVoucher.includes(data._id)){
      throw new BadRequestException ("Bạn đã có voucher này.")
    }

    await this.VoucherModel.updateOne({ _id: data._id }, { $inc: { remain: -1 } });
    
    return await this.CustomerModel.updateOne({userId: data.userId}, {voucher: [...listVoucher, data._id]})
  }

  async addCouponForCustomer (data : any) {
    if(!data || !data.userId){
      throw new BadRequestException ("Không xác định được khách hàng, vui lòng kiểm tra lại userId.")
    }

    const users = await this.CustomerModel.findOne({userId: data.userId})
    let listCoupon = users.coupon
    // check coupon đã được thêm chưa
    if(listCoupon.length>0 && listCoupon.includes(data._id)){
      throw new BadRequestException ("Bạn đã có coupon này.")
    }
    // giam di  so luong coupon con lai
    await this.CouponModel.updateOne({ _id: data._id }, { $inc: { remain: -1 } });
    return await this.CustomerModel.updateOne({userId: data.userId}, {coupon: [...listCoupon, data._id]})


  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} menuItemOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItemOption`;
  }
}
