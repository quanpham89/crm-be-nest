import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVoucherDto  {
    @IsNotEmpty({message: "_id không đươc để trống"})
    _id: string;

    @IsOptional()
    nameVoucher: string;

    @IsOptional()
    status: string;

    @IsOptional()
    createdBy: string;

    @IsOptional()
    endedDate: Date;
}
