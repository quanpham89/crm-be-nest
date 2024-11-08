import { Module } from '@nestjs/common';
import { OrderDetailService } from './order.detail.service';
import { OrderDetailController } from './order.detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetail, OrderDetailSchema } from './schemas/order.detail.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customers.schema';
import { Menu, MenuSchema } from '../menus/schemas/menu.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: OrderDetail.name, schema: OrderDetailSchema },
    { name: Order.name, schema: OrderSchema },
    { name: Customer.name, schema: CustomerSchema },
    { name: Menu.name, schema: MenuSchema },
    { name: Restaurant.name, schema: RestaurantSchema },




  ])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
})
export class OrderDetailModule {}
