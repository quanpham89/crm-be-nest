import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomersService } from './custormers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('custormers')
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
  findAll() {
    return this.customersService.findAll();
  }

  @Get('/get-customer-by-id')
  findOne(@Query('_id') _id: string) {
    return this.customersService.findOne(_id);
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
