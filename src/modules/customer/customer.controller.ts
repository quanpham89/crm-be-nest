import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('customers')
@Roles('CUSTOMER')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Post("/add-voucher-for-customer")
  @Public()
  addVoucherForCustomer( @Body() data  : any) {
    return this.customersService.addVoucherForCustomer(data);
  }

  

  @Post("/add-coupon-for-customer")
  @Public()
  addCouponForCustomer( @Body() data  : any) {
    return this.customersService.addCouponForCustomer(data);
  }

  @Get()
  @Public()
  findAll() {
    return this.customersService.findAll();
  }

  @Get('/get-customer-by-user-id')
  getCustomerByUserId(@Query('_id') _id: string) {
    return this.customersService.getCustomerByUserId(_id);
  }

  @Get('/get-customer-by-id')
  findOne(@Query('_id') _id: string) {
    return this.customersService.findOne(_id);
  }

  @Get('/get-voucher-create-by-admin')
  getVoucherCreateByAdmin(@Query('_id') _id: string) {
    return this.customersService.getVoucherCreateByAdmin(_id);
  }

  @Get('/get-coupon-create-by-admin')
  getCouponCreateByAdmin(@Query('_id') _id: string) {
    return this.customersService.getCouponCreateByAdmin(_id);
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
