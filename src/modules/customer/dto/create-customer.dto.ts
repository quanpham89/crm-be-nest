import { IsEmpty, IsOptional } from "class-validator";

export class CreateCustomerDto {
    @IsEmpty({message: "userId không được để trống"})
    userId: string;

    @IsOptional()
    restaurantId: string;

    @IsOptional()
    couponId: string;

    @IsOptional()
    voucherId: string;
}
