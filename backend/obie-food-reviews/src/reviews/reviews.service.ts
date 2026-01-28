import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from '../lib/supabase.admin';

@Injectable()
export class ReviewsService {
    async fetchReviews() {
        const { data, error } = await supabaseAdmin
            .from('ratings')
            .select('*, profiles(display_name), menu_items(name, menu_snapshots(dining_hall, meal, served_date))')
            .order('updated_at', { ascending: false })
            .limit(10);

        if (error) {
            throw new InternalServerErrorException('Failed to fetch reviews');
        }

        return data.map(row => {
            const mealRaw = row.menu_items.menu_snapshots.meal;
            const meal = typeof mealRaw === 'string' ? mealRaw.charAt(0).toUpperCase() + mealRaw.slice(1).toLowerCase() : null;
            
            return {
                displayName: row.profiles.display_name,
                menuItemName: row.menu_items.name,
                diningHall: row.menu_items.menu_snapshots.dining_hall,
                meal: meal,
                servedDate: row.menu_items.menu_snapshots.served_date,
                rating: row.rating,
                description: row.description,
                reviewUpdatedAt: row.updated_at,
            }
        });
    }

    async fetchMyReviews(requestedUserId: string) {
        const { data, error } = await supabaseAdmin
            .from('ratings')
            .select('*, id, profiles(display_name), menu_items(name, menu_snapshots(dining_hall, meal, served_date))')
            .eq('user_id', requestedUserId)
            .order('updated_at', { ascending: false })

        if (error) {
            throw new InternalServerErrorException('Failed to fetch my reviews');
        }
        
        return data.map(row => {
            const mealRaw = row.menu_items.menu_snapshots.meal;
            const meal = typeof mealRaw === 'string' ? mealRaw.charAt(0).toUpperCase() + mealRaw.slice(1).toLowerCase() : null;
            
            return {
                id: row.id,
                menuItemId: row.menu_item_id,
                displayName: row.profiles.display_name,
                menuItemName: row.menu_items.name,
                diningHall: row.menu_items.menu_snapshots.dining_hall,
                meal: meal,
                servedDate: row.menu_items.menu_snapshots.served_date,
                rating: row.rating,
                description: row.description,
                reviewUpdatedAt: row.updated_at,
            }
        });
    }
}