import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { supabaseAuth } from 'src/lib/supabase.auth';

/**
 * Guard to protect routes using Supabase authentication.
 */

@Injectable()
export class SupabaseAuthGuard implements CanActivate {

    /**
     * Validates the Bearer token from the Authorization header using Supabase.
     * On success, attaches the authenticated user to `request.user`.
     * 
     * @param context - NestJS execution context containing the HTTP request
     * @returns true if authentication succeeds
     * @throws UnauthorizedException if Authorization header is missing or malformed
     * @throws UnauthorizedException if token is invalid or expired
     */
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