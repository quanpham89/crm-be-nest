import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto  {
    @IsMongoId({message: "_id không hợp lệ"})
    @IsNotEmpty({message: "_id không được để trống"})
    _id: string;

    @IsOptional()
    name: string;
    phone: string;
    address: string;
    image: string;
}
