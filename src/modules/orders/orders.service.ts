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
import isBetween  from "dayjs/plugin/isBetween";

@Injectable()
export class OrdersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(OrderDetail.name) private OrderDetailModel: Model<OrderDetail>,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    @InjectModel(Voucher.name) private VoucherModel: Model<Customer>,
    @InjectModel(Coupon.name) private CouponModel: Model<Customer>,


   ){}
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
    const customer = await this.CustomerModel.findOne({_id: customerId})
    if( customer?.voucherUse.includes(voucher) || customer?.couponUse.includes(coupon)){
      throw new BadRequestException("Voucher hoặc Coupon này đã được dùng rồi.")
    }
    const listVoucherUse = [...customer.voucherUse, voucher]
    const listCouponUse = [...customer.couponUse, coupon]
    await this.CustomerModel.updateOne({_id: customerId}, {
      couponUse: listCouponUse,
      voucherUse: listVoucherUse
    })

// so sanh thoi han voucher va coupon
// khi get Coupon phai giam di 1
  dayjs.extend(isBetween);

    const voucherDoc = await this.VoucherModel.findOne({_id: voucher});
    if (dayjs(orderTime).isBetween(dayjs(voucherDoc.startedDate), dayjs(voucherDoc.endedDate), null, '[]')) {
        throw new BadRequestException("Voucher không hợp lệ hoặc đã hết hạn.");
    }
    

    const order = await this.OrderModel.create({
      customer : customerId,
      totalPrice,
      orderTime,
      predictionTime,
      paymentForm,
      address,
      totalWithoutDiscount,
      voucher,
      coupon
    })
    if(order._id){
      for(let i  = 0; i< cart.length;i++){
        const orderDetailId = await this.OrderDetailModel.create({
          menuItem: cart[i]?.menuItemId ,
          nameItemMenu: cart[i]?.nameItemMenu,
          restaurant: cart[i]?.restaurantId,
          restaurantName: cart[i]?.restaurantName,
          menu: cart[i]?.menuId,
          nameMenu: cart[i]?.nameMenu,
          amount: cart[i]?.amount,
          customer: customerId,
          sellingPrice: cart[i].sellingPrice,
          order : order._id
        })
        listOrderDetailId.push(orderDetailId._id)
      }
      await this.OrderModel.updateOne({_id: order._id}, {orderDetail: listOrderDetailId})

    }
    return {
      _id: order._id
    }
  }

  async findOrderById (_id: string){
    const response = await this.OrderModel.find({customer: _id})
    .populate({
      path: 'orderDetail',
      select: '-updatedAt -createdAt -__v',
      }).exec()
      return response
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
