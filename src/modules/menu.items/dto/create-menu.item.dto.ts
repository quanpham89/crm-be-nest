import { IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";

export class CreateMenuItemDto {
    @IsNotEmpty({message: "Name coupon không được để trống "})
    nameItemMenu: string;

    @IsNotEmpty({message: "Description không được để trống "})
    description: string;

    @IsOptional()
    image: string;

    @IsNotEmpty({message: "SellingPrice không được để trống "})
    sellingPrice: number;

    @IsNotEmpty({message: "fixedPrice không được để trống "})
    fixedPrice: number;

    @IsNotEmpty({message: "menuId không được để trống "})
    menuId:  mongoose.Types.ObjectId

    @IsNotEmpty({message: "nameMenu không được để trống "})   
    nameMenu: string;

    @IsOptional()
    deleteUrl: string;

  
}
