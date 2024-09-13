import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string;

    @IsNotEmpty({message: "password không được để trống"})
    password: string;

    @IsOptional()
    name: string;

}
