import { Controller, Put, Delete, UseGuards, Req, Param, HttpCode } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import type { Request } from 'express';

@Controller()
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @UseGuards(SupabaseAuthGuard)
    @Put('/ratings')
    async createOrUpdateRating(@Req() request: Request) {
        return { ok: true };
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete('/ratings/:menuItemId')
    @HttpCode(204)
    async deleteRating(@Param('menuItemId') menuItemId: string) {
        return; 
    }
    
}