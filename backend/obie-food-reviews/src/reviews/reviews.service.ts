import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from '../lib/supabase.admin';

@Injectable()
export class ReviewsService {
    async fetchReviews() {
        const { data, error } = await supabaseAdmin
            .from('ratings')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(10);

        if (error) {
            throw new InternalServerErrorException('Failed to fetch reviews');
        }

        return data;
    }
}