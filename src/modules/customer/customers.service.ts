import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customers.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,

   ){}
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new menuItemOption';
  }

  findAll() {
    return `This action returns all menuItemOptions`;
  }

  async findOne(_id: string) {
    if(!_id){
      throw new BadRequestException ("Không xác định được _id.")
    }else{
      const customer = await this.CustomerModel.findOne({userId: _id})
      .populate({
        path: "userId",
        select: "name email role accountType sex image isActive"
      })
      .select("-createdAt -updatedAt -__v")
      .exec()
      const data = { _id: customer._id, user: customer.userId }; 
      return data
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
      throw new BadRequestException ("Voucher đã được thêm, không thể tiếp tục thêm vào nữa.")
    }
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
      throw new BadRequestException ("Coupon đã được thêm, không thể tiếp tục thêm vào nữa.")
    }
    return await this.CustomerModel.updateOne({userId: data.userId}, {coupon: [...listCoupon, data._id]})


  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} menuItemOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItemOption`;
  }
}