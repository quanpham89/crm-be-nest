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
import { Menu } from '../menus/schemas/menu.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';

@Injectable()
export class OrderDetailService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(OrderDetail.name) private OrderDetailModel: Model<OrderDetail>,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    @InjectModel(Menu.name) private MenuModel: Model<Menu>,
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,


    

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
        let checkStatusReceive = order.orderDetail.every((item :any) => item.status === "ACCEPT")
        if(checkStatusReceive){
          await this.OrderModel.updateOne({_id: data.orderId}, {status: "ACCEPT"} )
        }
        let checkStatusSending = order.orderDetail.every((item :any) => item.status === "SENDING")
        if(checkStatusSending){
          await this.OrderModel.updateOne({_id: data.orderId}, {status: "SENDING"} )
        }
        let checkStatusPrepare = order.orderDetail.every((item :any) => item.status === "PREPARE")
        if(checkStatusPrepare){
          await this.OrderModel.updateOne({_id: data.orderId}, {status: "PREPARE"} )
        }
        // let checkStatusReject = order.orderDetail.some((item :any) => item.status === "REJECT")
        // if(checkStatusReject){
        //   await this.OrderModel.updateOne({_id: data.orderId}, {status: "REJECT"} )
        //   await this.OrderDetailModel.updateMany(
        //     { order: data.orderId }, 
        //     { status: "ONECANCEL" }
        //   );
        // }
      }

    }


  }

  async getAllFigureOrder(_id: string){

    const order = await this.OrderDetailModel.find({})
    const pending = (await this.OrderDetailModel.find({restaurant: _id, status: "PENDING"})).length
    const accept =  (await this.OrderDetailModel.find({restaurant: _id,  status: "ACCEPT" })).length
    const prepare = (await this.OrderDetailModel.find({restaurant: _id, status: "PREPARE"})).length
    const sending = (await this.OrderDetailModel.find({restaurant: _id, status: "SENDING"})).length
    const receive = (await this.OrderDetailModel.find({restaurant: _id, status: "RECEIVE"})).length
    const cancel = (await this.OrderDetailModel.find({restaurant: _id, status: "CANCEL"})).length
    const reject = (await this.OrderDetailModel.find({restaurant: _id, status: "REJECT"})).length
    
    const orderStatus = [
     { status: "pending", count: pending },
     { status: "accept", count: accept },
     { status: "prepare", count: prepare },
     { status: "sending", count: sending },
     { status: "receive", count: receive },
     { status: "cancel", count: cancel },
     { status: "reject", count: reject }
   ];
   return orderStatus
  }

  async getAllFigureOrderBookingBelongToMenu (_id: string) {
    const shop  = await this.RestaurantModel.findOne({_id: _id}).select("menuId") as any;
    console.log(shop)

    const data = await Promise.all(
      shop.menuId.map(async (menuId: string) => {
        const count =  ((await this.OrderDetailModel.find({ menu: menuId })).length) as number;
        const menu = await this.MenuModel.findById({_id: menuId}) as any;
        return {
          nameMenu: menu ? menu.nameMenu : "",
          count: count
        };
      })
    );
    return data
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
