import { Controller, Put, Delete, UseGuards, Req, Param, HttpCode, Body, BadRequestException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import type { Request } from 'express';

/**
 * A RatingsController to handle rating-related endpoints.
 * Provides routes to create/update and delete ratings for menu items.
 * All endpoints require authentication via SupabaseAuthGuard.
 */
@Controller()
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    /**
     * Creates or updates a rating for a menu item by the authenticated user.
     * Validates input data and ensures the user is authenticated.
     * @param request The Express request object containing user information
     * @param body The request body containing rating details
     * @returns The created or updated rating
     * @throws BadRequestException if input data is invalid (e.g., missing fields, invalid types, out-of-range values)
     * @route PUT /ratings
     */
    @UseGuards(SupabaseAuthGuard)
    @Put('/ratings')
    async createOrUpdateRating(@Req() request: Request, @Body() body: any) {
        
        const menuItemId: string = body?.menuItemId;
        const rating: number = body?.rating;
        let description = body?.description;

        if (typeof menuItemId !== 'string' || menuItemId.trim().length === 0) {
            throw new BadRequestException('menuItemId must be a non-empty string');
        }

        const uuidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


        if (!uuidFormat.test(menuItemId)) {
            throw new BadRequestException('menuItemId must be a UUID');
        }

        if (typeof rating !== 'number' || !Number.isInteger(rating)) {
            throw new BadRequestException('rating must be an integer between 1 and 5');
        }

        if (rating < 1 || rating > 5) {
            throw new BadRequestException('rating must be an integer between 1 and 5');
        }

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

        const userId = (request as any).user.id;

        return this.ratingsService.upsertRating({
            userId,
            menuItemId,
            rating,
            description
        });
    }

    /**
     * Deletes the authenticated user's rating for a specific menu item.
     * Requires authentication and validates the menuItemId parameter.
     * @param request The Express request object containing user information
     * @param menuItemId The ID of the menu item for which to delete the rating
     * @returns No content (204) on successful deletion
     * @throws BadRequestException if menuItemId is invalid (e.g., missing, not a string, not a UUID)
     * @route DELETE /ratings/:menuItemId
     */
    @UseGuards(SupabaseAuthGuard)
    @Delete('/ratings/:menuItemId')
    @HttpCode(204)
    async deleteRating(@Req() request: Request, @Param('menuItemId') menuItemId: string,) {

        const userId = (request as any).user.id;

        return this.ratingsService.deleteRating(userId, menuItemId);
    }
    
}