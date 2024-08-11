import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from '@src/api/profiles/dto/create-profile.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    type: 'string',
    description: 'title of the education',
  })
  @IsNotEmpty()
  educationTitle: string;

  @ApiProperty({
    type: 'string',
    description: 'starting date of the education',
    required: true,
  })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    type: 'string',
    description: 'ending date of the education',
    required: true,
  })
  @IsNotEmpty()
  endDate: string;


  @ApiProperty({
    type: 'string',
    description: 'description of the education',
    required: false,
    nullable: true
  })
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    type: CreateProfileDto,
    description: 'the profile of the dto',
    required: false,
  })
  profile?: CreateProfileDto;
}
