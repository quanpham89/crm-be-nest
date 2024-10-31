import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { throwError } from 'rxjs';
import { OrderDetail } from '../order.detail/schemas/order.detail.schema';
import { Voucher } from '../voucher/schemas/voucher.schema';
import { Coupon } from '../coupons/schemas/coupon.schema';
import { Customer } from '../customer/schemas/customers.schema';
import dayjs from 'dayjs';
import isBetween from "dayjs/plugin/isBetween";
import { CouponItem } from '../coupon.items/schemas/coupon.item.schema';
import { VoucherItem } from '../voucher.items/schemas/voucher.item.schema';

@Injectable()
export class OrdersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(OrderDetail.name) private OrderDetailModel: Model<OrderDetail>,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    @InjectModel(Voucher.name) private VoucherModel: Model<Customer>,
    @InjectModel(Coupon.name) private CouponModel: Model<Customer>,
    @InjectModel(CouponItem.name) private CouponItemModel: Model<CouponItem>,
    @InjectModel(VoucherItem.name) private VoucherItemModel: Model<VoucherItem>,

  ) { }
  async create(createOrderDto: CreateOrderDto) {
    const {
      customerId,
      totalPrice,
      orderTime,
      predictionTime,
      paymentForm,
      address,
      totalWithoutDiscount,
      cart,
      voucher,
      coupon
    } = createOrderDto
    const listOrderDetailId = [];

    const voucherDoc: any = await this.VoucherModel.findOne({ _id: voucher })
    .populate({
      path: "voucherItemId",
      match: {
        status: "UNUSED",
        customer: null,
        orderUse: null
      },
      select: "_id status customer orderUse"
    }).exec();
    const couponDoc: any = await this.CouponModel.findOne({ _id: coupon })
      .populate({
        path: "couponItemId",

        select: "_id status customer orderUse"
      }).exec();
      let voucherItem  = ""
      let couponItem  = ""

    // check date coupon and voucher
    if(voucher || coupon){
      dayjs.extend(isBetween);
      if (!dayjs(orderTime).isBetween(dayjs(voucherDoc.startedDate), dayjs(voucherDoc.endedDate), null, '[]')) {
        throw new BadRequestException("Voucher đã đã hết hạn sử dụng, vui lòng sử dụng voucher khác.");
      }
  
      
      if (!dayjs(orderTime).isBetween(dayjs(couponDoc.startedDate), dayjs(couponDoc.endedDate), null, '[]')) {
        throw new BadRequestException("Coupon đã đã hết hạn sử dụng, vui lòng sử dụng coupon khác.");
      }
  
      // check coupon, voucher đã được dùng chưa
      
      const customer = await this.CustomerModel.findOne({ _id: customerId })
      
      if (customer?.voucherUse.includes(voucher)) {
        throw new BadRequestException("Voucher này đã được dùng rồi.")
      }
      if ( customer?.couponUse.includes(coupon)) {
        throw new BadRequestException("Coupon này đã được dùng rồi.")
      }

      const listVoucherUse = [...customer.voucherUse, voucher]
      const listCouponUse = [...customer.couponUse, coupon]
      await this.CustomerModel.updateOne({ _id: customerId }, {
        couponUse: listCouponUse,
        voucherUse: listVoucherUse
      })
    }

    const order = await this.OrderModel.create({
      customer: customerId,
      totalPrice,
      orderTime,
      predictionTime,
      paymentForm,
      address,
      totalWithoutDiscount,
      voucher,
      coupon
    })
    if (order._id) {
      for (let i = 0; i < cart.length; i++) {
        const orderDetailId = await this.OrderDetailModel.create({
          menuItem: cart[i]?.menuItemId,
          nameItemMenu: cart[i]?.nameItemMenu,
          restaurant: cart[i]?.restaurantId,
          restaurantName: cart[i]?.restaurantName,
          menu: cart[i]?.menuId,
          nameMenu: cart[i]?.nameMenu,
          amount: cart[i]?.amount,
          customer: customerId,
          sellingPrice: cart[i].sellingPrice,
          order: order._id
        })
        listOrderDetailId.push(orderDetailId._id)
      }
      await this.OrderModel.updateOne({ _id: order._id }, { orderDetail: listOrderDetailId })
      if(voucher && voucherDoc.voucherItemId && voucherDoc.voucherItemId.length > 0){
        voucherItem = voucherDoc.voucherItemId[0]._id
        await this.VoucherItemModel.updateOne({_id: voucherItem}, {
          customer: customerId, 
          orderUse: order._id,
          status: "USED",
          usedTime: orderTime
        })
      }else{
        throw new BadRequestException("Không tìm được voucherItem.")
      }

      if(coupon && couponDoc.couponItemId && couponDoc.couponItemId.length > 0){
        couponItem = couponDoc.couponItemId[0]._id
        await this.CouponItemModel.updateOne({_id: couponItem}, {
          customer: customerId, 
          orderUse: order._id,
          status: "USED",
          usedTime: orderTime
        })
      }else{
        throw new BadRequestException("Không tìm được couponItem.")
      }

    }
    return {
      _id: order._id
    }
  }

  async findOrderById(_id: string) {
    const response = await this.OrderModel.find({ customer: _id })
      .populate({
        path: 'orderDetail',
        select: '-updatedAt -createdAt -__v',
      }).exec()
    return response
  }

  async handleCloseOrder (_id: string){
    if(_id){
      return await this.OrderModel.updateOne({_id: _id}, {
        status: "CANCLE"
      })
    }else{
      throw new BadRequestException("Không xác định được _id order.")
    }
  }

  async handleReceiveOrder (_id: string){
    if(_id){
    return await this.OrderModel.updateOne({_id: _id}, {
      status: "COMPLETE"
    })
    }else{
      throw new BadRequestException("Không xác định được _id order.")
    }
  }
  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
