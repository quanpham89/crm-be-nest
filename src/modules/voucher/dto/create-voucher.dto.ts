import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVoucherDto {

    @IsNotEmpty({message: "Name voucher không được để trống "})
    nameVoucher: string;

    @IsNotEmpty({message: "Amount không được để trống "})
    amount: number;

    @IsNotEmpty({message: "Description không được để trống "})
    description: string;

    @IsNotEmpty({message: "Type không được để trống "})
    type: string;

    @IsNotEmpty({message: "for không được để trống "})
    forAge: string;

    @IsNotEmpty({message: "percentage không được để trống "})
    percentage: number

    @IsOptional()
    status: string;

    @IsOptional()
    createdBy: string;

    @IsOptional()
    image: string;

    @IsNotEmpty({message: "Ngày bắt đầu có hiệu lực không được để trống"})
    endedDate: Date;

    @IsNotEmpty({message: "Ngày kết thúc không được để trống"})
    startedDate: Date;

    @IsNotEmpty({message: "id người tạo không được để trống"})
    userCreateId: Date;

}

export class SearchVoucerDto{
    @IsOptional()
    nameVoucher: string;

    @IsOptional()
    _id: string;

    @IsOptional()
    type: string;

    @IsOptional()
    forAge: string;

    @IsOptional()
    startedTime: Date;

    @IsOptional()
    endedTime: Date;

    @IsOptional()
    userCreateId: string;

}