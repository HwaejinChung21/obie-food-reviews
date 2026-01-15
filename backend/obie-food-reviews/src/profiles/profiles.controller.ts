import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ProfilesService } from './profiles.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';

@Controller()
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}

    @UseGuards(SupabaseAuthGuard)
    @Get('/me')
    async me(@Req() request: Request) {
        const user = (request as any).user;
        const id = user.id;
        const email = user.email;

        const profile = await this.profilesService.getOrCreateProfile({ id, email });
        return { auth: user, profile };
    }
    
}