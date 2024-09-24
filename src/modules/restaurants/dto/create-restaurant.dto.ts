import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateRestaurantDto {
    @IsNotEmpty({message: "Tên nhà hàng không được để trống "})
    restaurantName: string;

    @IsNotEmpty({message: "Điện thoại không được để trống "})
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
