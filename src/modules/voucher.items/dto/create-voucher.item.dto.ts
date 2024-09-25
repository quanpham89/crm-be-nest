import {     IsNotEmpty, IsOptional } from "class-validator";

export class CreateVoucherItemDto {
    @IsNotEmpty({message: "Name không đươc để trống"})
    nameVoucherItem: string;
    
    @IsNotEmpty({message: "Description không đươc để trống"})    
    description: string;
    
    @IsNotEmpty({message: "Status không đươc để trống"})    
    status: string;
   
    @IsOptional()    
    codeId: string;

    @IsOptional()    
    codeExpired: Date;
    
}
