import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty({message: "Name coupon không được để trống "})
    nameMenu: string;

    @IsNotEmpty({message: "Description không được để trống "})
    description: string;

    @IsOptional()
    image: string;

    @IsOptional()
    status: string;

    @IsOptional()
    createdBy: string;

    @IsNotEmpty({message: "useCreateId không được để trống "})
    userCreateId: string

    @IsNotEmpty({message: "restaurantId không được để trống "})
    restaurantId: string
}
