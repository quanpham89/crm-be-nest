import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRestaurantDto  {
    @IsMongoId({message: "_id không hợp lệ"})
    @IsNotEmpty({message: "_id không được để trống"})
    _id: string;

    @IsNotEmpty({message: "Name không được để trống "})
    name: string;

    @IsNotEmpty({message: "Phone không được để trống "})
    phone: string;

    @IsNotEmpty({message: "Address không được để trống "})
    address: string;

    @IsOptional()
    rating: string;

    @IsOptional()
    description: string;

    @IsOptional()
    image: string;
    
    @IsOptional()
    userId: string;

    @IsOptional()
    menuId: string

    @IsOptional()
    isShow: boolean
}
