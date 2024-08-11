import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Expertise } from './entities/expertise.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { GetUser } from '../user/decorator/get-user.decorator';
import { ApiResponses, createApiResponses } from '@src/shared/api-response';

@Injectable()
export class ExpertisesService {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly userService: UserService,
    @InjectRepository(Expertise)
    private readonly expertiseRepository: Repository<Expertise>,
  ) {}

  async create(createExpertiseDto: CreateExpertiseDto,
    @GetUser() user: User
    ): Promise<ApiResponses> {
      const createdExpertise: Expertise = await this.createInstanceExpertise(
        createExpertiseDto,
        user,
      );
      delete createdExpertise.profile.expertise;
      const savedExpertise: Expertise = await this.expertiseRepository.save(createdExpertise);
      return createApiResponses({
        statusCode: HttpStatus.CREATED,
        message: "Expertise created succefully",
        data: savedExpertise,
      });
    }

  async findAll(): Promise<ApiResponses> {
    const expertise: Expertise[] = await this.expertiseRepository.find({
      relations:{
        profile: true
      }
    });
    const responseExpertise: Expertise[] = expertise.map((expertise)=> {
      delete expertise.profile.expertise;
      return expertise
    }); 
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: "Retrieved all expertise succefully",
      data: responseExpertise,
    })
  }

  async findOne(id: string):Promise<ApiResponses> {
    const expertise: Expertise = await this.expertiseRepository.findOne({
      where: { id: id },
      relations: {
        profile: true,
      }
    });
    delete expertise.profile.expertise;
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'An expertise retrieved succefully',
      data: expertise,

    });
  }

  async update(id: string, updateExpertiseDto: UpdateExpertiseDto, user: User): Promise<ApiResponses> {
    const createdExpertise: Expertise = await this.createInstanceExpertise(
      updateExpertiseDto,
      user,
      true,
      id,
    );
    delete createdExpertise.profile.expertise;
    const updateExpertise: Expertise = await this.expertiseRepository.save(
      createdExpertise
    );
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'Expertise updated succefully',
      data: updateExpertise,
    });
  }  

  async remove(id: string):Promise<ApiResponses> {
    const responseExpertise = await this.expertiseRepository.delete(id);
    if(!responseExpertise.affected){
      throw new NotFoundException(`Expertise not found`);
    }
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'Expertise deleted succefully',
      data: responseExpertise.affected === 1,

    });
  }

  private async createInstanceExpertise(
    expertiseDto: CreateExpertiseDto | UpdateExpertiseDto,
    user: User,
    isUpdate: boolean = false,
    id?: string,
  ): Promise<Expertise> {
    if(!expertiseDto || !user){
      throw new BadRequestException(`invalid input`);
    }
    const userExisting = await this.userService.findUserByMail(user["email"]);
    const profileUser = await this.profileService.findProfileByUser(userExisting.id);
    const expertise: Expertise = await this.expertiseRepository.create({
      ...expertiseDto,
      profile: profileUser,
    });
    if(isUpdate){
      expertise.id = id
    };
    return expertise;
  }
}
