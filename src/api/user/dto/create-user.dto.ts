import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {

	@ApiProperty({
		description: 'Email of the user',
	})
	@IsEmail()
	@IsNotEmpty()
	@MaxLength(255)
	email: string;

	@ApiProperty({
		description: 'Password of the user',
	})
	@IsString()
	@Exclude({ toPlainOnly: true })
	@IsNotEmpty()
	@MinLength(8)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
	password: string;
}
