import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from '@src/api/profiles/profiles.module';
import { UserModule } from '@src/api/user/user.module';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { Education } from './entities/education.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Education]), ProfilesModule, UserModule],
  controllers: [EducationController],
  providers: [EducationService]
})
export class EducationModule { }
