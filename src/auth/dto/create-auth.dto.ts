import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string;

    @IsNotEmpty({message: "password không được để trống"})
    password: string;

    @IsOptional()
    name: string;

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

export class CodeAuthDto {
    @IsNotEmpty({message: "Không tìm thấy _id"})
    _id: string;

    @IsNotEmpty({message: "code không được để trống"})
    code: string;
}

export class changePasswordDto {
    @IsNotEmpty({message: "Code không được để trống"})
    code: string;

    @IsNotEmpty({message: "Password không được để trống"})
    password: string;

    @IsNotEmpty({message: "Confirm password không được để trống"})
    confirmPassword: string;

    @IsNotEmpty({message: "Email không được để trống"})
    email: string;
}