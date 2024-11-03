import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateVoucherDto, SearchVoucerDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VouchersService } from './vouchers.service';
import { Public, Roles } from '@/decorator/customize';
@Controller('vouchers')
@Roles('ADMINS', 'ADMIN', "BUSINESSMAN")
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get("/12")
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get("")
  findVoucherPerPage(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.vouchersService.findVoucherPerPage(query, +current, +pageSize);
  }

  @Get('/get-all-voucher')
  @Public()
  getAllVoucher() {
    return this.vouchersService.getAllVoucher();
  }

  @Get('/get-all-vouchers-belong-to-restaurant')
  @Public()
  getVoucherBelongRestaurant( @Query("_id") _id:string,) {
    return this.vouchersService.getVoucherBelongRestaurant(_id);
  }

  @Get('/get-voucher-by-id')
  getItemVoucherForVoucher(@Query("_id") _id: string) {
    return this.vouchersService.getItemVoucherForVoucher(_id);
  }

  @Get('/get-voucher-create-by-admin')
  @Roles('CUSTOMER')
  getVoucherCreateByAdmin() {
    return this.vouchersService.getVoucherCreateByAdmin();
  }

  @Post('/search')
  searchVoucher(@Body() data : any) {    
    return this.vouchersService.searchVoucher(data);
  }

  @Patch('/update')
  update(@Body() updateVoucherDto: UpdateVoucherDto) {
    return this.vouchersService.update(updateVoucherDto);
  }

  @Patch('/soft-delete')
  softDelete(@Query("_id") _id: string) {
    return this.vouchersService.softDelete(_id);
  }

  @Patch('/active-voucher')
  activeVoucher(@Query("_id") _id: string) {
    return this.vouchersService.activeVoucher(_id);
  }

  @Delete('remove')
  remove(@Query('_id') _id: string) {
    return this.vouchersService.remove(_id);
  }
}
