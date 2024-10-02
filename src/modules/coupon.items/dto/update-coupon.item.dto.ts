import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponItemDto } from './create-coupon.item.dto';

export class UpdateCouponItemDto extends PartialType(CreateCouponItemDto) {}
