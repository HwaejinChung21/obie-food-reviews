import { Controller, Get } from '@nestjs/common';

@Controller()
export class ReviewsController {
    
    @Get('/reviews')
    getReviews() {
        return { items: []};
    }
}