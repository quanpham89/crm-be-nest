import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateVoucherDto, SearchVoucerDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VouchersService } from './vouchers.service';
import { Public } from '@/decorator/customize';
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @Public()
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

  @Get('/get-voucher-by-id')
  getItemvoucherForVoucher(@Query("_id") _id: string) {
    return this.vouchersService.getItemvoucherForVoucher(_id);
  }

  @Get('/search')
  searchVoucher(@Body() searchVoucher : SearchVoucerDto) {
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


  @Delete('remove')
  remove(@Query('_id') _id: string) {
    return this.vouchersService.remove(_id);
  }
}
