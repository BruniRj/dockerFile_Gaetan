import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../user/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationService } from './education.service';

@Controller('education')
@ApiTags('Education')
@UseInterceptors(ClassSerializerInterceptor)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @ApiBearerAuth()
  @Post('/create-education')
  async create(
    @GetUser() user: User,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    return await this.educationService.create(user, createEducationDto);
  }

  @ApiBearerAuth()
  @Get('/all-education')
  async findAll() {
    return await this.educationService.findAll();
  }

  @ApiBearerAuth()
  @Get('/profile/:id')
  async findByProfile(@Param('id') id: string) {
    return await this.educationService.getEducationsByProfileId(id);
  }

  @ApiBearerAuth()
  @Get(':id/education')
  async findOne(@Param('id') id: string) {
    return await this.educationService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id/education')
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return await this.educationService.update(id, updateEducationDto, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.educationService.remove(id);
  }
}
