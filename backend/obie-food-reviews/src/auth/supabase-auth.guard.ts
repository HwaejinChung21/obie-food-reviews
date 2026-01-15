import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { supabaseAuth } from 'src/lib/supabase.auth';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const token = authHeader.substring('Bearer '.length).trim();

        const { data, error } = await supabaseAuth.auth.getUser(token);

        if (error || !data.user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        // Attach user info to request object
        request.user = data.user;

        return true;
    }
}