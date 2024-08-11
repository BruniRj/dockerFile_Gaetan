import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/api/user/entities/user.entity';
import { ApiResponses, createApiResponses } from '@src/shared/api-response';
import moment from 'moment';
import { Repository } from 'typeorm';
import { ProfilesService } from '../profiles/profiles.service';
import { UserService } from '../user/user.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Education } from './entities/education.entity';

@Injectable()
export class EducationService {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly userService: UserService,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  async create(
    user: User,
    createEducationDto: CreateEducationDto,
  ): Promise<ApiResponses> {
    const createEducation: Education = await this.createEducationInstance(
      createEducationDto,
      user,
    );
    delete createEducation.profile.educations;
    const saveEducation: Education = await this.educationRepository.save(
      createEducation,
    );

    return createApiResponses({
      statusCode: HttpStatus.CREATED,
      message: `profile's education created successfully`,
      data: saveEducation,
    });
  }

  async findAll(): Promise<ApiResponses> {
    const allEducation: Education[] = await this.educationRepository.find({
      relations: {
        profile: true,
      },
    });
    const responseEducation: Education[] = allEducation.map((education) => {
      delete education.profile.educations;
      return education;
    });
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'list of education retrieved succefully',
      data: responseEducation,
    });
  }

  async findOne(id: string): Promise<ApiResponses> {
    const education: Education = await this.educationRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
    delete education.profile.educations;
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'An education retrieved succefully',
      data: education,
    });
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
    user: User,
  ): Promise<ApiResponses> {
    const createdEducation: Education = await this.createEducationInstance(
      updateEducationDto,
      user,
      true,
      id,
    );
    delete createdEducation.profile.educations;
    const updateEducation: Education = await this.educationRepository.save(
      createdEducation,
    );

    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'Education updated succefully',
      data: updateEducation,
    });
  }

  async remove(id: string): Promise<ApiResponses> {
    const result = await this.educationRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Education not found`);
    }
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'Education deleted succefully',
      data: result.affected === 1,
    });
  }

  private async createEducationInstance(
    educationDto: CreateEducationDto | UpdateEducationDto,
    user: User,
    isUpdate: boolean = false,
    id?: string,
  ): Promise<Education> {
    if (!educationDto || !user) {
      throw new BadRequestException('Invalid request');
    }
    const userExisting = await this.userService.findUserByMail(user['email']);
    const profileUser = await this.profileService.findProfileByUser(
      userExisting.id,
    );

    const education: Education = this.educationRepository.create({
      ...educationDto,
      startDate: moment(educationDto.endDate).format('YYYY-MM-DD'),
      endDate: moment(educationDto.endDate).format('YYYY-MM-DD'),
      profile: profileUser,
    });
    if (isUpdate) {
      education.id = id;
    }
    return education;
  }

  async getEducationsByProfileId(
    profileId: string,
  ): Promise<ApiResponses<Education[]>> {
    const educations: Education[] = await this.educationRepository.find({
      where: {
        profile: {
          id: profileId,
        },
      },
    });

    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'Educations retrieved succefully',
      data: educations,
    });
  }
}
