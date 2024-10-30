import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
export class CreateOrderDto {
    @IsNotEmpty({message: "userId không được để trống "})
    customerId: string;

    @IsNotEmpty({message: "totalPrice không được để trống "})
    totalPrice: number;

    @IsNotEmpty({message: "orderTime không được để trống "})
    orderTime: Date;

    @IsNotEmpty({message: "predictionTime không được để trống "})
    predictionTime: string

    @IsNotEmpty({message: "paymentForm không được để trống "})
    paymentForm: string;

    @IsNotEmpty({message: "address không được để trống "})
    address: string;

    @IsNotEmpty({message: "totalPrice không được để trống "})
    totalWithoutDiscount : number;

    @IsNotEmpty({message: "cart không được để trống "})
    cart : any;

    @IsOptional()
    voucher: string

    @IsOptional()
    coupon: string

}


export class CreateRestaurantDto {
   
}

