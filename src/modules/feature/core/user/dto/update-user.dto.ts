import { IsEmail, IsEnum, IsString, IsStrongPassword, Length } from "class-validator";
import { user_role } from "prisma/generated/prisma/browser";

export class UpdateUserDto {

    @IsEmail()
    email: string;

    @IsEnum(user_role)
    role: user_role;

    @IsString()
    @Length(8, 100)
    password?: string;
}