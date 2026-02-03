import { isString, IsString, Length } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    current_password: string;

    @IsString()
    @Length(6, 255)
    new_password: string;
}