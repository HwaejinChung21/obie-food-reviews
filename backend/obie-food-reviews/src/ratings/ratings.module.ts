import { Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

/**
 * A RatingsModule to bundle rating-related functionality.
 * Provides endpoints for creating/updating and deleting ratings for menu items.
 */
@Module({
    imports: [],
    controllers: [RatingsController],
    providers: [RatingsService]
})

export class RatingsModule {}