import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Name không được để trống "})
    name: string;

    @IsNotEmpty({message: "Email không được để trống "})
    @IsEmail({}, {message: "Email không đúng định dạng"})
    email: string;

    @IsNotEmpty({message: "password không được để trống "})
    password: string;
    
    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    accountType: string;

    @IsOptional()
    role: string;

    @IsOptional()
    image: string;
    
    @IsOptional()
    sex: string;

    @IsOptional()
    birthday: Date

    @IsOptional()
    isActive: boolean


}
