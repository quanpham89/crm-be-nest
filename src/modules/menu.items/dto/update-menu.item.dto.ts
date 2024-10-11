import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu.item.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateMenuItemDto{

    @IsNotEmpty({message: "action coupon không được để trống "})
    action: string;
    
    @IsNotEmpty({message: "Name coupon không được để trống "})
    nameItemMenu: string;

    @IsNotEmpty({message: "Description không được để trống "})
    description: string;

    @IsNotEmpty({message: "SellingPrice không được để trống "})
    sellingPrice: number;

    @IsNotEmpty({message: "fixedPrice không được để trống "})
    fixedPrice: number;

    @IsOptional()
    image: string;

    @IsOptional()
    deleteUrl: string;

    @IsOptional()
    quantity: string
}
