import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class MailDataDto {
  @ApiProperty({
    description: 'Mail to send the information',
    required: true,
  })
  @IsString()
  @IsEmail()
  public to: string;

  @ApiProperty({
    description: 'Motif of the email',
    required: true,
  })
  @IsString()
  public subject: string;

  @ApiProperty({
    description: 'Content of the email',
    required: true,
  })
  @IsString()
  public text: string;
}
