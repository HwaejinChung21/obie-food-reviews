import { Injectable } from '@nestjs/common';
import { supabaseAdmin } from '../lib/supabase.admin';

@Injectable()
export class ReviewsService {
    async fetchReviews() {
        const { data, error } = await supabaseAdmin
            .from('reviews')
            .select('*');

        if (error) {
            throw new Error('Failed to fetch reviews');
        }

        return data;
    }
}