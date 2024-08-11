import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';


@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {

    constructor(private reflector:Reflector) {
        super();
    }

    // This method is called by Nest to determine whether the current request is allowed to proceed.
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);     // The getAllAndOverride() method returns the value of the isPublic metadata key if it exists on the handler method or the controller class. If it doesn't exist, it returns undefined.

        if (isPublic) return true;

        return super.canActivate(context);      // If the isPublic metadata key doesn't exist, the canActivate() method calls the canActivate() method of the base class, which in turn calls the validate() method of the JwtStrategy class.
    }
}
