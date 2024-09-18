import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Name không được để trống "})
    name: string;

    @IsNotEmpty({message: "Email không được để trống "})
    @IsEmail({}, {message: "Email không đúng định dạng"})
    email: string;

    @IsNotEmpty({message: "password không được để trống "})
    password: string;

    phone: string;
    address: string;
    accountType: string;
    role: string;
    image: string;
    sex: string;
    birthday: Date


}
