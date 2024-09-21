import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto  {
    @IsMongoId({message: "_id không hợp lệ"})
    @IsNotEmpty({message: "_id không được để trống"})
    _id: string;

    @IsNotEmpty({message: "Email không được để trống"})
    email: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    accountType: string;

    @IsOptional()
    role: string;

    @IsOptional()
    image: string;
    
    @IsOptional()
    sex: string;

    @IsOptional()
    isActive: boolean
}
