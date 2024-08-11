import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from '../profiles/profiles.module';
import { UserModule } from '../user/user.module';
import { Expertise } from './entities/expertise.entity';
import { ExpertisesController } from './expertises.controller';
import { ExpertisesService } from './expertises.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expertise]),
    ProfilesModule,
    UserModule
  ],
  controllers: [ExpertisesController],
  providers: [ExpertisesService],
})
export class ExpertisesModule {

}
