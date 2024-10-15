import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMenuDto  {

    @IsNotEmpty({message: "_id không được để trống "})
    _id: string;

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

   
}
