import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateFeedbackDto {
       @IsNotEmpty({message: "customerId không được để trống "})
        customerId: string;

        @IsNotEmpty({message: "restaurantId không được để trống "})
        restaurantId: string;
    
        @IsNotEmpty({ message: "menuItemId không được để trống"})
        menuItemId: string;

        @IsOptional()
        comment: string;  

        @IsNotEmpty({ message: "vote không được để trống"})
        rate: string;    
}
