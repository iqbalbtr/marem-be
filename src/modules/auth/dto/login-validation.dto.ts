import { IsString, Length } from "class-validator";

export class LoginValidationDto {

    @Length(3,50)
    @IsString()
    email: string;
    
    @Length(2,255)
    @IsString()
    password: string;
}