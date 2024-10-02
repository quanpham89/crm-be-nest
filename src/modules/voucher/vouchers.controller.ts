import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateVoucherDto, SearchVoucerDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VouchersService } from './vouchers.service';
import { Public, Roles } from '@/decorator/customize';
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @Roles('ADMINS', 'ADMIN')
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Get("/12")
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get("")
  @Roles('ADMINS', 'ADMIN')
  findVoucherPerPage(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.vouchersService.findVoucherPerPage(query, +current, +pageSize);
  }

  @Get('/get-voucher-by-id')
  @Roles('ADMINS', 'ADMIN')
  getItemvoucherForVoucher(@Query("_id") _id: string) {
    return this.vouchersService.getItemvoucherForVoucher(_id);
  }

  @Get('/search')
  @Roles('ADMINS', 'ADMIN')
  searchVoucher(
    @Query("searchValue") searchValue : string
  ) {
    let searchVoucher : SearchVoucerDto = JSON.parse(searchValue)
    return this.vouchersService.searchVoucher(searchVoucher);
  }

  @Patch('/update')
  @Roles('ADMINS', 'ADMIN')
  update(@Body() updateVoucherDto: UpdateVoucherDto) {
    return this.vouchersService.update(updateVoucherDto);
  }

  @Roles('ADMINS', 'ADMIN')
  @Patch('/soft-delete')
  softDelete(@Query("_id") _id: string) {
    return this.vouchersService.softDelete(_id);
  }

  @Roles('ADMINS', 'ADMIN')
  @Patch('/active-voucher')
  activeVoucher(@Query("_id") _id: string) {
    return this.vouchersService.activeVoucher(_id);
  }

  @Roles('ADMINS', 'ADMIN')
  @Delete('remove')
  remove(@Query('_id') _id: string) {
    return this.vouchersService.remove(_id);
  }
}
