import { Injectable } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@src/api/user/entities/user.entity';
import { JwtPayload } from '@src/api/user/jwt/jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@src/api/user/user.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    Logger.error(email);
    const user = await this.userService.findUserByMail(email);

    if (!user) {
      throw new UnauthorizedException("USER NOT FOUND");
    }

    return user;
  }
}
