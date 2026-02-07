import { Controller, UseGuards, Get, Req, Patch, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
import type { Request } from 'express';
import { ProfilesService } from './profiles.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';

/**
 * A ProfilesController to handle profile-related endpoints.
 * Provides routes to get and update user profiles.
 */
@Controller()
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

    /**
     * Gets the authenticated user's profile information.
     * Requires authentication via SupabaseAuthGuard.
     * @param request - Express request object containing authenticated user info
     * @returns An object containing auth info and profile data
     * @throws {UnauthorizedException} If user is not authenticated
     * @route GET /me
     */
    @UseGuards(SupabaseAuthGuard)
    @Get('/me')
    async me(@Req() request: Request) {
        const user = (request as any).user;
        const id = user.id;
        const email = user.email;

        const profile = await this.profilesService.getOrCreateProfile({ id, email });
        return {
            "auth": { id, email},
            "profile": profile
        }
    }

    /**
     * Updates the authenticated user's display name.
     * Requires authentication via SupabaseAuthGuard.
     * @param request - Express request object containing authenticated user info and new display name
     * @returns An object containing auth info and updated profile data
     * @throws {UnauthorizedException} If user is not authenticated
     * @throws {BadRequestException} If display_name is invalid (wrong type, length, or characters)
     * @throws {ConflictException} If display_name is already taken
     * @route PATCH /me
     */
    @UseGuards(SupabaseAuthGuard)
    @Patch('/me')
    async updateMe(@Req() request: Request) {
        const user = (request as any).user;
        const id = user.id;
        const email = user.email;

        const raw = (request.body as any)?.display_name;

        if (typeof raw !== 'string') {
            throw new BadRequestException('display_name must be a string');
        }

        const display_name = raw.trim();

        if (display_name.length < 3 || display_name.length > 20) {
            throw new BadRequestException('display_name must be between 3 and 20 characters');
        }

        if (!/^[A-Za-z0-9._]+$/.test(display_name)) {
            throw new BadRequestException('display_name can only contain letters, numbers, dots, and underscores');
        }

        try {
            const updatedProfile = await this.profilesService.updateProfileDisplayName(id, display_name);
            return {
                "auth": { id, email},
                "profile": updatedProfile
            };
        } catch (error: any) {
            if (error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            throw error;
        }
    }
    
}