import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('orders')
@Roles('ADMINS', 'ADMIN', "BUSINESSMAN", "CUSTOMER")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get("/get-order-by-id")
  findById(@Query("_id") _id:string  ) {
    return this.ordersService.findOrderById(_id);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }




  @Get('/get-all-figure-order')
  @Public()
  getAllFigureOrder() {
    return this.ordersService.getAllFigureOrder();
  }


  @Patch("/cancel-order")
  handleCloseOrder(@Query("_id") _id: string) {
    return this.ordersService.handleCancleOrder(_id);
  }

  @Patch("/receive-order")
  handleReceiveOrder( @Query("_id") _id: string) {
    return this.ordersService.handleReceiveOrder(_id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
