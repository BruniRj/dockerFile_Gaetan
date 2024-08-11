import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/api/user/entities/user.entity';
import { UserController } from '@src/api/user/user.controller';
import { UserService } from '@src/api/user/user.service';
import { EmailModule } from '@src/shared/mail/email.module';
import { ApiKeyGuardModule } from '@src/api/common/guards/api-key/api-key.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, ApiKeyGuardModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
