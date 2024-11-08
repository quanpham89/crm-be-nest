import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderDetailService } from './order.detail.service';
import { CreateOrderDetailDto } from './dto/create-order.detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order.detail.dto';
import { Roles } from '@/decorator/customize';

@Controller('order-detail')
@Roles('ADMIN',"ADMINS","BUSINESSMAN")
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) { }

  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @Get("/get-data-order-detail")
  getDataOrderDetailByRestaurantId(
    @Query("_id") _id:string,
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.orderDetailService.getDataOrderDetailByRestaurantId(_id, query, +current, +pageSize);
  }

  @Get('/get-all-figure-order-detail-by-id')
  getAllFigureOrder(@Query("_id") _id:string) {
    return this.orderDetailService.getAllFigureOrder(_id);
  }

  @Get('/get-all-figure-order-detail-booking-belong-to-menu-by-id')
  getAllFigureOrderBookingBelongToMenu(@Query("_id") _id:string) {
    return this.orderDetailService.getAllFigureOrderBookingBelongToMenu(_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(+id);
  }

  @Post("/change-order-detail-status")
  changeStatusOrderDetailItem(@Body() data :any) {
    return this.orderDetailService.changeStatusOrderDetailItem(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(+id);
  }
}
