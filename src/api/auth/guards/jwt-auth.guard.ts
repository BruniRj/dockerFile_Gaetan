import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic: boolean = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler()
        );

        if(isPublic) return true;

        if(await super.canActivate(context)) return true;
        
        return false;
    }
}