import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
    @IsNotEmpty({message: "_id không đươc để trống"})
    _id: string;

    @IsOptional()
    nameCoupon: string;

    @IsOptional()
    status: string;

    @IsOptional()
    createdBy: string;

    @IsOptional()
    startedDate: Date;

    @IsOptional()
    endedDate: Date;

    @IsOptional()
    userCreateId: string;
}
