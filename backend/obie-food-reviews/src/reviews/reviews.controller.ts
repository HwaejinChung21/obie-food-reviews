import { Controller, Get } from '@nestjs/common';

@Controller('reviews')
export class ReviewsController {
    
    @Get('/reviews')
    getReviews() {
        return { items: []};
    }
}