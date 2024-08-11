import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserSignUpValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      throw new BadRequestException(
        'All fields { username, email, password } are required.',
      );
    }
    return true;
  }
}

@Injectable()
export class UserSignInValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;

    if (!email || !password) {
      throw new BadRequestException(
        'All {email , password } fields are required.',
      );
    }
    return true;
  }
}
