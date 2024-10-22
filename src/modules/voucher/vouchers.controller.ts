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

  @Get('/get-voucher-by-id')
  getItemvoucherForVoucher(@Query("_id") _id: string) {
    return this.vouchersService.getItemvoucherForVoucher(_id);
  }

  @Get('/search')
  searchVoucher(
    @Query("searchValue") searchValue : string,
    @Query("belongTo") belongTo : string
  ) {
    let searchVoucher : SearchVoucerDto = JSON.parse(searchValue)
    return this.vouchersService.searchVoucher(searchVoucher);
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
