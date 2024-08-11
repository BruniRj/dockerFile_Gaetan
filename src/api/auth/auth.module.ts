import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@src/api/auth/auth.controller';
import { AuthService } from '@src/api/auth/auth.service';
import { AccessTokenStrategy } from '@src/api/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@src/api/auth/strategies/refreshToken.strategy';
import { UserModule } from '@src/api/user/user.module';

@Module({
  imports: [JwtModule.register({
  }), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
