import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../user/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';
import { ExpertisesService } from './expertises.service';

@Controller('expertises')
@ApiTags("Expertises")
@UseInterceptors(ClassSerializerInterceptor)
export class ExpertisesController {
  constructor(private readonly expertisesService: ExpertisesService) {}

  @ApiBearerAuth()
  @Post('/create-expertise')
  async create(@Body() createExpertiseDto: CreateExpertiseDto,
  @GetUser() user: User,
  ) {
    return this.expertisesService.create(createExpertiseDto, user);
  }

  @ApiBearerAuth()
  @Get('/all-expertise')
  async findAll() {
    return this.expertisesService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id/expertise')
  async findOne(@Param('id') id: string) {
    return this.expertisesService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id/expertise')
  async update(@Param('id') id: string, @Body() updateExpertiseDto: UpdateExpertiseDto, 
  @GetUser() user:User
  ) {
    return this.expertisesService.update(id, updateExpertiseDto, user);
  }

  @ApiBearerAuth()
  @Delete(':id/expertise')
  remove(@Param('id') id: string) {
    return this.expertisesService.remove(id);
  }
}
