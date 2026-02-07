import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

/**
 * A ReviewsModule to bundle review-related functionality.
 * Provides endpoints for fetching all reviews and the authenticated user's reviews.
 */
@Module({
    imports: [],
    controllers: [ReviewsController],
    providers: [ReviewsService]
})

export class ReviewsModule {}