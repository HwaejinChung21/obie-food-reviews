import { Controller, Put, Delete, UseGuards, Req, Param, HttpCode, Body, BadRequestException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import type { Request } from 'express';

@Controller()
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @UseGuards(SupabaseAuthGuard)
    @Put('/ratings')
    async createOrUpdateRating(@Req() request: Request, @Body() body: any) {
        
        const menuItemId: string = body?.menu_item_id;
        const rating: number = body?.rating;
        let description = body?.description;

        if (typeof menuItemId !== 'string') {
            throw new BadRequestException('menu_item_id must be a non-empty string');
        }

        const uuidV4ish = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidV4ish.test(menuItemId)) {
            throw new BadRequestException('menuItemId must be a UUID');
        }

        if (typeof rating !== 'number' || !Number.isInteger(rating)) {
            throw new BadRequestException('rating must be an integer between 1 and 5');
        }

        if (rating < 1 || rating > 5) {
            throw new BadRequestException('rating must be an integer between 1 and 5');
        }

        // description: optional, trim, empty -> null, max 280
        if (description === undefined || description === null) {
            description = null;
        } else {
            if (typeof description !== 'string') {
                throw new BadRequestException('description must be a string');
            }

            description = description.trim();

            if (description.length === 0) description = null;

            if (description !== null && description.length > 280) {
            throw new BadRequestException('description max length is 280');
            }
        }

        return {
            ok: true,
            userId: (request as any).user.id,
            menuItemId,
            rating,
            description
        }
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete('/ratings/:menuItemId')
    @HttpCode(204)
    async deleteRating(@Param('menuItemId') menuItemId: string) {
        return  
    }
    
}