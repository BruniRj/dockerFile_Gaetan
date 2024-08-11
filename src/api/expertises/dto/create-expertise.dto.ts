import { ApiProperty } from "@nestjs/swagger";
import { CreateProfileDto } from "@src/api/profiles/dto/create-profile.dto";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateExpertiseDto {
    @ApiProperty({
        description: "Domain of the expertise",
        type: String,
        nullable: false,
        required: true,
    })
    @IsNotEmpty()
    domain: string[];

    @ApiProperty({
        description: "Description of the expertise",
        type: String,
        nullable: true,
        required: false,
    })
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @ApiProperty({
        description: "Profile of the expertise",
        type: CreateProfileDto,
    })
    profile?: CreateProfileDto;
}