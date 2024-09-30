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

    @IsOptional()
    status: string;

    @IsOptional()
    createdBy: string;

    @IsOptional({message: "Ngày bắt đầu có hiệu lực không được để trống"})
    endedDate: Date;

    @IsOptional({message: "Ngày kết thúc không được để trống"})
    startedDate: Date;
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

}