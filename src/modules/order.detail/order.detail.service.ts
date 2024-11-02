import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order.detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order.detail.dto';
import { ConfigService } from '@nestjs/config';
import { Order } from '../orders/schemas/order.schema';
import { OrderDetail } from './schemas/order.detail.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../customer/schemas/customers.schema';
import aqp from 'api-query-params';

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

  async getDataOrderDetailByRestaurantId (_id: string, query: string, current : number, pageSize: number){
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.OrderDetailModel.find({restaurant: _id})).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)
    const orderDetails = await this.OrderDetailModel.find({restaurant: _id})
     .populate({
      path: "customer",
      select: "-createdAt -updatedAt -coupon -voucher",
      populate: ({
        path: "userId",
        select : "name"
      })
    })
    .limit(pageSize)
    .skip(skip)
    .lean()
    return {orderDetails, totalItems, totalPages}
  }

  async changeStatusOrderDetailItem (data: any){
    console.log(data)

    const listStatusUnCheck = [
      "SENDING",
      "COMPLETE",
      "RECEIVE",
      "DENIED",
      "CANCEL",
      "REJECT",
    ];


    await this.OrderDetailModel.updateOne({_id: data._id}, {status: data.status})
    const order :any = await this.OrderModel.findOne({_id: data.orderId}).populate({
      path: "orderDetail",
      select : "status"
    }).lean()

    if(order ){
      if(!listStatusUnCheck.includes(order.status)){
        let checkstatusReceive = order.orderDetail.every((item :any) => item.status === "ACCEPT")
        if(checkstatusReceive){
          await this.OrderModel.updateOne({_id: data.orderId}, {status: "ACCEPT"} )
        }
        let checkstatusSending = order.orderDetail.every((item :any) => item.status === "SENDING")
        if(checkstatusSending){
          await this.OrderModel.updateOne({_id: data.orderId}, {status: "SENDING"} )
        }
        let checkstatusPrepare = order.orderDetail.every((item :any) => item.status === "PREPARE")
        if(checkstatusPrepare){
          await this.OrderModel.updateOne({_id: data.orderId}, {status: "PREPARE"} )
        }
        // let checkstatusReject = order.orderDetail.some((item :any) => item.status === "REJECT")
        // if(checkstatusReject){
        //   await this.OrderModel.updateOne({_id: data.orderId}, {status: "REJECT"} )
        //   await this.OrderDetailModel.updateMany(
        //     { order: data.orderId }, 
        //     { status: "ONECANCEL" }
        //   );
        // }
      }

    }


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
