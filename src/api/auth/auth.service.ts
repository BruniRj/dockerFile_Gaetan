import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@src/api/auth/dto/jwt.payload';
import { CreateUserDto } from '@src/api/user/dto/create-user.dto';
import { SignInUserDto } from '@src/api/user/dto/signIn-user.dto';
import { User } from '@src/api/user/entities/user.entity';
import { UserService } from '@src/api/user/user.service';
import { ApiResponses, createApiResponses } from '@src/shared/api-response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ApiResponses> {
    return this.usersService.create(createUserDto);
  }

  async signIn(signInUserDto: SignInUserDto): Promise<ApiResponses> {
    const { email, password } = signInUserDto;
    const user = await this.usersService.findUserByMail(email);

    if (!user) throw new BadRequestException('User does not exist');

    if (!(await UserService.validatePassword(password, user)))
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: `Hello ${email}, you're connected successfully !!`,
      data: tokens,
    });
  }

  async logout(userId: string): Promise<ApiResponses> {
    const user = await this.usersService.updateRefreshToken(userId, null);
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: `User signed in successfully`,
      data: user,
    });
  }

  public async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<ApiResponses> {
    const user: User = (await this.usersService.getUserById(userId)).data;

    if (!user || !user.refreshTokenHashed)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHashed,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'Tokens refreshed successfully',
      data: tokens,
    });
  }

  async getTokens(userId: string, username: string): Promise<JwtPayload> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        },
      ),
    ]);

    return new JwtPayload(accessToken, refreshToken);
  }

  async validateAccessToken(accessToken: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(accessToken);
      // You can also perform other checks here if necessary, for example, checking if the user exists in the database, if he has the correct permissions, etc.

      return decodedToken;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async getSelf(sub: string) {
    const user = await this.usersService.getUserWithProfile(sub);

    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    });
  }
}
