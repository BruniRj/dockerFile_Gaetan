import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@src/api/auth/auth.service';
import { CreateUserDto } from '@src/api/user/dto/create-user.dto';
import { AccessTokenGuard } from '@src/api/common/guards/accessToken.guard';
import { RefreshTokenGuard } from '@src/api/common/guards/refreshToken.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInUserDto } from '@src/api/user/dto/signIn-user.dto';
import { Param, UseInterceptors } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiResponses } from '@src/shared/api-response';
import { UserSignInValidationGuard } from '@src/api/common/guards/user-validation.guards';
import { UserService } from '@src/api/user/user.service';
import {
  EmailAndPasswordDto,
  EmailResetPassword,
  ResetPasswordData,
} from '@src/api/user/dto/reset-password';
import { Public } from '@src/api/user/decorator/public.decorator';

@Controller('auth')
@ApiTags('Authentification')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Sign Up an User [1*]',
  })
  @Public()
  @Post('register')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @ApiOperation({
    summary: 'Sign In an User [3*]',
  })
  @Post('login')
  @Public()
  @UseGuards(UserSignInValidationGuard)
  async signin(@Body() signInUserDto: SignInUserDto) {
    return await this.authService.signIn(signInUserDto);
  }

  @ApiOperation({
    summary: 'Logout of an User',
  })
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req.user['sub']);
  }

  @ApiOperation({
    summary: 'Refresh a Token User',
  })
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() request: Request) {
    const [userId, refreshToken] = [
      request.user['sub'],
      request.user['refreshToken'],
    ];
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @ApiOperation({
    summary: 'Confirm user account creation [2*]',
  })
  @Get('/confirm/:code')
  async confirmAccount(@Param('code') code: string) {
    return await this.userService.confirmAccount(code);
  }

  @ApiOperation({
    summary:
      'Generate a 5-digit code then send it by email to reset the password [1**]',
  })
  @Post('generate-code')
  async requestResetCode(@Body() emailUser: EmailResetPassword) {
    const resp = await this.userService.generateResetCode(emailUser);
    if (resp !== 0) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Code sent successfully !!',
        data: resp,
      } as ApiResponses;
    }
  }

  @ApiOperation({
    summary: 'Verify the code sent by email to reset the password [2**]',
  })
  @Post('verify-code')
  async verifyResetCode(@Body() resetPasswordData: ResetPasswordData) {
    return await this.userService.checkResetCode(resetPasswordData);
  }

  @ApiOperation({
    summary: "Send data to reset the user's password [3**]",
  })
  @Post('reset-password')
  async resetPassword(@Body() emailAndPasswordDto: EmailAndPasswordDto) {
    if (await this.userService.resetPassword(emailAndPasswordDto)) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset successfully !!',
      };
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user information',
  })
  @Get('self')
  async getSelf(@Req() request: Request) {
    const userId = request.user['id'];
    return await this.authService.getSelf(userId);
  }
}
