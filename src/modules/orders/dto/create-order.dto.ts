import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
export class CreateOrderDto {
    @IsNotEmpty({message: "userId không được để trống "})
    userId: string;

    @IsNotEmpty({message: "menuId không được để trống "})
    menuId: string;

    @IsNotEmpty({message: "ItemId không được để trống "})
    menuItemId: string;

    @IsNotEmpty({message: "restaurantId không được để trống "})
    restaurantId: string;

    @IsNotEmpty({message: "totalPrice không được để trống "})
    totalPrice: string;

    @IsNotEmpty({message: "orderTime không được để trống "})
    orderTime: Date;

    @IsNotEmpty({message: "paymentForm không được để trống "})
    paymentForm: string;

    @IsNotEmpty({message: "address không được để trống "})
    address: string;

}


export class CreateRestaurantDto {
   
}
