import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        return true;
    }
}