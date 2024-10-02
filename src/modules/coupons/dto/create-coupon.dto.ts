import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty({message: "Name coupon không được để trống "})
    nameCoupon: string;

    @IsNotEmpty({message: "Amount không được để trống "})
    amount: number;

    @IsNotEmpty({message: "Description không được để trống "})
    description: string;

    // @IsNotEmpty({message: "Type không được để trống "})
    // type: string;

    @IsNotEmpty({message: "scope không được để trống "})
    scope: string;

    @IsOptional()
    status: string;

    @IsOptional()
    createdBy: string;

    @IsOptional({message: "Ngày bắt đầu có hiệu lực không được để trống"})
    endedDate: Date;

    @IsOptional({message: "Ngày kết thúc không được để trống"})
    startedDate: Date;

    @IsNotEmpty({message: "id người tạo không được để trống "})
    userCreateId: string

    @IsNotEmpty({message: "Phần trăm không được để trống "})
    discount: string
}

export class SearchCouponDto{
    @IsOptional()
    nameCoupon: string;

    @IsOptional()
    _id: string;

    @IsOptional()
    discount: string;

    @IsOptional()
    scope: string;

    @IsOptional()
    startedTime: Date;

    @IsOptional()
    endedTime: Date;

}
