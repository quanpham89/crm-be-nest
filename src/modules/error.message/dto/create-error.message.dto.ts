import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateErrorMessageDto {

    @IsNotEmpty({message: "userId không được để trống "})
    userId: string;

    @IsNotEmpty({ message: "description không được để trống"})
    description: string;

    @IsNotEmpty({ message: "role không được để trống"})
    role: string;
    

    

}
