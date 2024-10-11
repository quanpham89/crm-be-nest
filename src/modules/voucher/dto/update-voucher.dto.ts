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
    startedDate: Date;

    @IsOptional()
    endedDate: Date;

    @IsOptional()
    userCreateId: string;

    @IsOptional()
    percentage: number

}
