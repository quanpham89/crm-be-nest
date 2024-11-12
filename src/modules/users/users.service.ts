import { Customer } from './../customer/schemas/customers.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import {Model} from "mongoose"
import { hashPaswwordHelper } from '@/helpers/ulti';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { changePasswordDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import {v4 as uuidv4} from "uuid"
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { CouponItem } from '../coupon.items/schemas/coupon.item.schema';
import { Coupon } from '../coupons/schemas/coupon.schema';
import { MenuItem } from '../menu.items/schemas/menu.item.schema';
import { Menu } from '../menus/schemas/menu.schema';
import { OrderDetail } from '../order.detail/schemas/order.detail.schema';
import { Order } from '../orders/schemas/order.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { VoucherItem } from '../voucher.items/schemas/voucher.item.schema';
import { Voucher } from '../voucher/schemas/voucher.schema';
import path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(CouponItem.name) private CouponItemModel: Model<CouponItem>,
    @InjectModel(Coupon.name) private CouponModel: Model<Coupon>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,
    @InjectModel(Menu.name) private MenuModel: Model<Menu>,
    @InjectModel(OrderDetail.name) private OrderDetailModel: Model<OrderDetail>,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,
    @InjectModel(VoucherItem.name) private VoucherItemModel: Model<VoucherItem>,
    @InjectModel(Voucher.name) private VoucherModel: Model<Voucher>,



    private readonly mailerService : MailerService
  ){}

  isEmailExist = async (email: String ) => {
    let isExist = await this.userModel.exists({email})
    return isExist ? true :false
  }


  async create(createUserDto: CreateUserDto) {
    const {name, email, password, phone, address, image, accountType, role, sex, birthday, isActive, restaurantId } = createUserDto
    // check exist
    const isExist = await this.isEmailExist(email)
    if(isExist){
      throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác.} `)
    }

    // hashPassword
    const hashPassword = await hashPaswwordHelper(password)
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, image, accountType, role, sex, birthday, restaurantId, isActive, address
    })


    // customer
    if(role === "CUSTOMER"){
      await this.customerModel.create({
        userId: user._id,
      })
    }
    return {
      _id: user._id
    };
  }

  async findAll(query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results = await this.userModel
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .select("-password -updatedAt -codeExpired -codeId -createdAt -__v" )

    return {results, totalItems, totalPages};
  }

  async getFigureDataUser () {
    const user = await this.userModel.find({})
    const totalUser = user.length
    let businessman = []
    let customer = []
    let customerUnActive = []
    let businessmanUnActive = []
    user.forEach((item)=>{
      if(item.role === "BUSINESSMAN" && item.isActive){
        businessman.push(item)
      }
      if(item.role === "BUSINESSMAN" && !item.isActive){
        businessmanUnActive.push(item)
      }
      if(item.role === "CUSTOMER" && item.isActive){
        customer.push(item)
      }
      if(item.role === "CUSTOMER" && !item.isActive){
        customerUnActive.push(item)
      }
    })

    let other =  Number(totalUser - businessman.length - businessmanUnActive.length - customer.length - customerUnActive.length)
    const firgureUser = [
      { label: "Người kinh doanh được kích hoạt", count:  businessman.length },
      { label: "Tài khoản kinh doanh chưa kích hoạt", count: businessmanUnActive.length },
      { label: "Tài khoản khách được kích hoạt", count: customer.length },
      { label: "Tài khoản khách chưa kích hoạt", count: customerUnActive.length },
      { label: "Khác", count: other },
    ]; 
    return firgureUser
  }

  async findAllIdUserBusinessman(){
    const user = await this.userModel.find({
      role : "BUSINESSMAN",
      isActive: true,
      restaurantId: null

      }).select("_id name")
    return user
  }

  async findOne(_id: string) {
    if(!_id){
      throw new BadRequestException("Người dùng chưa đăng kí tài khoản.")
    }else{
        const _menuIds = await this.userModel.findOne({_id: _id}).select("menuId")
        const response = await this.userModel.findOne({_id: _id})
        .populate({
        path: 'restaurantId',
        select: '-updatedAt -createdAt -__v',
        populate: {
          path: 'menuId',
          match: { _id: { $in: _menuIds }},
          select: '-updatedAt -createdAt -__v'
        }
      }
      
    )
      .select('-updatedAt -createdAt -__v')
      .exec();

      return response
    }
  }

  async findByEmail (email : string) {
    return await this.userModel.findOne({email})
  }

  async updateUser( updateUserDto: UpdateUserDto) {

    return await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto})
  }

  async softDelete (_id: string) {
    return await this.userModel.updateOne({_id: _id}, {
      isActive: false
    })

  }

  async remove(_id: string) {
    // check id
    if(mongoose.isValidObjectId(_id)){
      await this.CouponModel.deleteOne({userCreateId: _id})
      await this.VoucherModel.deleteOne({userCreateId: _id})
      const customer = await this.customerModel.findOne({userId: _id})
      if(customer?._id){
        await this.CouponItemModel.deleteOne({customer: _id},)
        await this.VoucherItemModel.deleteOne({customer: _id})
      }
      await this.customerModel.deleteOne({userId: _id})
      await this.MenuModel.deleteOne({userCreateId: _id})
      await this.RestaurantModel.deleteOne({userId: _id})
      const menus = await this.MenuModel.find({menuItemId: _id})
      for (const item of menus) {
        await this.MenuItemModel.deleteMany({ menuId: item._id });
    }
      await this.MenuModel.deleteMany({userCreateId: _id})

      
      // delete
      return this.userModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { email, password, name, isActive, role, phone, sex, accountType, address} = registerDto
    const codeId = uuidv4()
    // check exist
    const isExist = await this.isEmailExist(email)
    if(isExist){
      throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác. `)
    }

    // hashPassword
    const hashPassword = await hashPaswwordHelper(password)
    const user = await this.userModel.create({
      name, email, password: hashPassword,
      isActive , codeId,
      role, phone, sex, accountType,
      address,
      codeExpired: dayjs().add(5, "minutes")
    })

    await this.customerModel.create({
      userId: user._id,
    })

    //  response request
    const templatePath = path.resolve(__dirname, 'src/mail/templates');
    // send email
    // this.mailerService.sendMail({
    //   to: email, // list of receivers
    //   subject: "Activate your account", // Subject line
    //   text: 'welcome', // plaintext body
    //   template: "Register",
    //   context: {
    //     name: user?.name ?? user.email,
    //     activationCode: codeId,
    //   },
    // })
    // .then(() => {})
    // .catch(() => {});
    const dataEmail = {
      name: user?.name ?? user.email,
      activationCode: codeId,
    }
    // send email
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: "Activate your account", // Subject line
      text: 'welcome', // plaintext body
      html: this.getHtmlBody(dataEmail)
    })
    .then(() => {})
    .catch(() => {});
    return {
      _id: user._id,
      codeId: user.codeId
    }
  }

  async handleVerify(data : CodeAuthDto){
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if(!user) {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn.")
    }
    // check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired)
    if(isBeforeCheck) {
      // valid
      await this.userModel.updateOne({
        _id: data._id,
        codeId: data.code
      },{
        isActive: true
      })

    }else{
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn.")
    }
    return {
      _id: user._id
    };
  }

  async reActiveAccount (email : string) {
    const user = await this.userModel.findOne({email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại.")
    }
    if(user.isActive){
      throw new BadRequestException("Tài khoản đã được kích hoạt.")
    }

    // update user
    const codeId = uuidv4()
    await user.updateOne({
      codeId,
      codeExpired : dayjs().add(5,'minutes')
    },{
      isActive: true
    })
    const dataEmail = {
      name: user?.name ?? user.email,
      activationCode: codeId,
    }
    // send email
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: "Activate your account", // Subject line
      text: 'welcome', // plaintext body
      html: this.getHtmlBody(dataEmail)
    })
    .then(() => {})
    .catch(() => {});
    return {
      _id: user._id
    }
    // this.mailerService.sendMail({
    //   to: email, // list of receivers
    //   subject: "Activate your account", // Subject line
    //   text: 'welcome', // plaintext body
    //   template: "Register",
    //   context: {
    //     name: user?.name ?? user.email,
    //     activationCode: codeId,
        
    //   }
    // })
    // .then(() => {})
    // .catch(() => {});
    // return {
    //   _id: user._id
    // }
  }

  async resendPassword (email : string) {
    const user = await this.userModel.findOne({email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại.")
    }

    // update user
    const codeId = uuidv4()
    await user.updateOne({
      codeId,
      codeExpired : dayjs().add(5,'minutes')
    },{
      isActive: true
    })
    // send email
    const dataEmail = {
      name: user?.name ?? user.email,
      activationCode: codeId,
    }
    // send email
    this.mailerService.sendMail({
      to: email, // list of receivers
      subject: "Activate your account", // Subject line
      text: 'welcome', // plaintext body
      html: this.getHtmlBody(dataEmail)
    })
    .then(() => {})
    .catch(() => {});
    // this.mailerService.sendMail({
    //   to: 'phamdinhquan202@gmail.com', // list of receivers
    //   subject: "Change your password", // Subject line
    //   text: 'welcome', // plaintext body
    //   template: "changePassword",
    //   context: {
    //     name: user?.name ?? user.email,
    //     activationCode: codeId,
        
    //   }
    // })
    // .then(() => {})
    // .catch(() => {});
    return {
      _id: user._id,
      email: user.email
    }
  }


  async changePassword (data : changePasswordDto) {
    if(data.confirmPassword !== data.password){
      throw new BadRequestException("Mật khẩu/ xác nhận mật khẩu không trùng khớp.")
 
    }
    const user = await this.userModel.findOne({email : data.email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại.")
    }

    // check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired)
    if(isBeforeCheck) {
      const newPassword = await hashPaswwordHelper(data.password)
      // valid
      await this.userModel.updateOne({
        password: newPassword,
      },{
        isActive: true
      })

    }else{
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn.")
    }

    
    return {
      _id: user._id,
      email: user.email
    }
  }


  async getTestData(){
    return "Data test"
  }


  getHtmlBody = (data : any) =>{
    return `
    <div
    style="margin: 0; padding: 0; min-width: 100%; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; background-color: #FAFAFA; color: #222222;">
    <div style="max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0070f3; padding: 24px; color: #ffffff;">
            <h1
                style="font-size: 24px; font-weight: 700; line-height: 1.25; margin-top: 0; margin-bottom: 15px; text-align: center;">
                Welcome to our service</h1>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
            <p style="margin-top: 0; margin-bottom: 24px;">Hello ${data.name},</p>
            <p style="margin-top: 0; margin-bottom: 24px;">Thank you for registering our service. To activate your
                account, please use the following activation code:</p>
            <h2
                style="font-size: 20px; font-weight: 700; line-height: 1.25; margin-top: 0; margin-bottom: 15px; text-align: center;">
                ${data.activationCode}</h2>
            <p style="margin-top: 0; margin-bottom: 24px;">Please enter this code on the activation page within the next
                5 minutes.</p>
            <p style="margin-top: 0; margin-bottom: 24px;">If you did not register for this account, please
                ignore this email.</p>
        </div>
    </div>
</div>`
  }



}





