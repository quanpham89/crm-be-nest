import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { throwError } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private OrderModel: Model<Order>,

   ){}
  async create(createOrderDto: CreateOrderDto) {
    const {userId, totalPrice, orderTime, menuItemId, menuId, restaurantId, paymentForm } = createOrderDto
    const order = await this.OrderModel.create({
      userId, totalPrice, orderTime, menuItemId, menuId, restaurantId, paymentForm
    })
    return {
      _id: order._id
    }
  }

  async findOrderById (_id: string){
    const response = await this.OrderModel.find({_id: _id})
    .populate({
      path: 'restaurantId',
      select: '-updatedAt -createdAt -__v',
      populate: {
        path: 'menuId',
        match: { _id: "67023d240f9780da45d7a43c" },
        select: '-updatedAt -createdAt -__v',
        populate: {
          path: 'menuItemId',
          match: { _id: "67074737e8c68120e4cfb24b" },
          select: '-updatedAt -createdAt -__v'
        }
      }
    })
    .populate({
      path: 'userId',
      select: '-updatedAt -createdAt -__v',
    })
    .select('-updatedAt -createdAt -__v')
    .lean()
    .exec();
    if(response) {
      return response
    }else{
      throw new BadRequestException("order invalid")
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
