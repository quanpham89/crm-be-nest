import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order.detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order.detail.dto';
import { ConfigService } from '@nestjs/config';
import { Order } from '../orders/schemas/order.schema';
import { OrderDetail } from './schemas/order.detail.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../customer/schemas/customers.schema';

@Injectable()
export class OrderDetailService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(OrderDetail.name) private OrderDetailModel: Model<OrderDetail>,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    

  ) { }

  create(createOrderDetailDto: CreateOrderDetailDto) {
    return 'This action adds a new orderDetail';
  }

  async getDataOrderDetailByRestaurantId (_id: string){
    const orderDetails = await this.OrderDetailModel.find({restaurant: _id})
     .populate({
      path: "customer",
      select: "-createdAt -updatedAt -coupon -voucher",
      populate: ({
        path: "userId",
        select : "name"
      })
    })
    .lean()
    return orderDetails
  }

  async changeStatusOrderDetailItem (data: any){
    console.log(data)

  }

  findAll() {
    return `This action returns all orderDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }
}
