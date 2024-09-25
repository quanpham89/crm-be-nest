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
}
