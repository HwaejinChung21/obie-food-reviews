import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}
    
    @Get('/reviews')
    getReviews() {
        return this.reviewsService.fetchReviews();
    }

    @Get('/my-reviews')
    // @UseGuards(SupabaseAuthGuard)
    getMyReviews(@Req() req: any) {
        // Extract user ID from the authenticated request
        const userId = "test-user-id"
        return this.reviewsService.fetchMyReviews(userId);
    }
}