import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/api/auth/auth.module';
import { JwtAuthGuard } from '@src/api/auth/guards/jwt-auth.guard';
import { JwtStrategyModule } from '@src/api/common/strategies/jwt-strategy/jwt-strategy.module';
import { EducationModule } from '@src/api/education/education.module';
import { ExpertisesModule } from '@src/api/expertises/expertises.module';
import { ProfilesModule } from '@src/api/profiles/profiles.module';
import { RewardModule } from '@src/api/reward/reward.module';
import { SkillsModule } from '@src/api/skills/skills.module';
import { UserModule } from '@src/api/user/user.module';
import { dataSourceOptions } from '@src/db/data-source';
import { multerOptions } from '@src/utils/multer-config';
import { join } from 'path';
import { ProfileServiceModule } from '@src/api/profile-service/profile-service.module';
import { PortfolioModule } from '@src/api/portfolio/portfolio.module';
import { GenerateDataModule } from '@src/api/generate-data/generate-data.module';
import { ServeStaticModule } from '@nestjs/serve-static';



@Module({
  imports: [
    MulterModule.register(multerOptions),
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.APP_PASSWORD_MAIL,
        },
      },
      template: {
        dir: join(__dirname, 'utils'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // Indicate that the data stored in the cache has no expiration
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UserModule,
    JwtStrategyModule,
    AuthModule,
    ProfilesModule,
    RewardModule,
    EducationModule,
    SkillsModule,
    ExpertisesModule,
    ProfileServiceModule,
    PortfolioModule,
    GenerateDataModule,
  ],
  providers: [
    {
      provide: APP_GUARD, // APP_GUARD is a special token that allows us to provide a global guard
      useClass: JwtAuthGuard, // We provide the class of the guard we want to use
    },
  ],
})
export class AppModule { }
