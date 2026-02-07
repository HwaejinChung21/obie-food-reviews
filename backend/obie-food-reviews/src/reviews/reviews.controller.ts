import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

/**
 * A ReviewsController to handle review-related endpoints.
 * Provides routes to fetch all reviews and the authenticated user's reviews.
 * The /my-reviews endpoint requires authentication via SupabaseAuthGuard.
 * The /reviews endpoint is public and does not require authentication.
 */
@Controller()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}
    
    /**
     * Fetches all reviews.
     * @returns A list of all reviews
     */
    @Get('/reviews')
    getReviews() {
        return this.reviewsService.fetchReviews();
    }

    /**
     * Fetches reviews for the authenticated user.
     * @param req The request object containing the authenticated user's information
     * @returns A list of reviews by the authenticated user
     */
    @Get('/my-reviews')
    @UseGuards(SupabaseAuthGuard)
    getMyReviews(@Req() req: any) {
        // Extract user ID from the authenticated request
        const userId = req.user.id;
        return this.reviewsService.fetchMyReviews(userId);
    }
}