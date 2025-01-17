import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@src/api/user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
