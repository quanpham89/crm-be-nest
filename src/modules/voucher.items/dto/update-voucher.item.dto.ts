import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherItemDto } from './create-voucher.item.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVoucherItemDto extends PartialType(CreateVoucherItemDto) {
    @IsNotEmpty({message: "Name không đươc để trống"})
    nameVoucherItem: string;
    
    @IsNotEmpty({message: "Description không đươc để trống"})    
    description: string;
    
    @IsNotEmpty({message: "Status không đươc để trống"})    
    status: string;
   
    @IsOptional()    
    codeId: string;

    @IsOptional()    
    startedDate: Date

    @IsOptional()    
    endedDate : Date
}
