import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, SearchCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('coupons')
@Roles('ADMINS', 'ADMIN')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Public()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  findCouponPerPage(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.couponsService.findCouponPerPage(query, +current, +pageSize);
  }

  @Get('/get-coupon-by-id')
  @Roles('ADMINS', 'ADMIN')
  getItemCouponForCoupon(@Query("_id") _id: string) {
    return this.couponsService.getItemCouponForCoupon(_id);
  }

  @Get('/search')
  searchCoupon(
    @Query("searchValue") searchValue : string
  ) {
    let searchCoupon : SearchCouponDto = JSON.parse(searchValue)
    return this.couponsService.searchCoupon(searchCoupon);
  }

  @Patch('/update')
  @Roles('ADMINS', 'ADMIN')
  update(@Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(updateCouponDto);
  }

  @Patch('/soft-delete')
  softDelete(@Query("_id") _id: string) {
    return this.couponsService.softDelete(_id);
  }

  

  @Roles('ADMINS', 'ADMIN')
  @Patch('/active-coupon')
  activeVoucher(@Query("_id") _id: string) {
    return this.couponsService.activeCoupon(_id);
  }

  @Roles('ADMINS', 'ADMIN')
  @Delete('remove')
  remove(@Query('_id') _id: string) {
    return this.couponsService.remove(_id);
  }
}
