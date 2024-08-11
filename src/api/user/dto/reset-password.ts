import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ResetPasswordData {
    
    @ApiProperty({
        description:"Email of the user",
        type:String,
        required:true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description:"Code of the user",
        type:String,
        required:false
    })
    @IsNumber()
    @IsOptional()
    code?: number;

}




export class EmailResetPassword {

    @ApiProperty({
        description:"Email of the user",
        type:String,
        required:true
    })
    @IsEmail()
    @IsNotEmpty()
    userEmail: string;

}


export class EmailAndPasswordDto {

    @ApiProperty({
        description:"Email of the user",
        type:String,
        required:true
    })
    @IsEmail()
    @IsNotEmpty()
    userEmail: string;


    @ApiProperty({
        description:"Password of the user",
        type:String,
        required:true
    })
    @IsEmail()
    @IsNotEmpty()
    password: string;

}