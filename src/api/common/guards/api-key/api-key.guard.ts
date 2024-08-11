import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";


@Injectable()
export class ApiKeyGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp().getRequest();
        const key = ctx.headers['x-api-key'];
        
        if (key === process.env.API_KEY) return true;

        return false;
    }
}