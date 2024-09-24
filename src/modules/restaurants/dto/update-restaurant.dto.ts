import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRestaurantDto  {
    @IsMongoId({message: "_id không hợp lệ"})
    @IsNotEmpty({message: "_id không được để trống"})
    _id: string;

    @IsNotEmpty({message: "Tên không được để trống "})
    restaurantName: string;

    @IsNotEmpty({message: "Số điện thoại không được để trống "})
    phone: string;

    @IsNotEmpty({message: "Địa chỉ không được để trống "})
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

    @IsOptional()
    productType: string
}
