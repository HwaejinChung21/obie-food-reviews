import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from '../lib/supabase.admin';

/**
 * Handles review data operations.
 * Manages fetching reviews from Supabase, including all reviews and reviews specific to a user.
 */
@Injectable()
export class ReviewsService {

    /**
     * Fetches all reviews from the database, including related profile and menu item information.
     * @returns A list of all reviews with associated profile and menu item details
     * @throws {InternalServerErrorException} If fetching reviews fails
     */
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

    /**
     * Fetches reviews for a specific user from the database, including related profile and menu item information.
     * @param requestedUserId The ID of the user whose reviews are to be fetched
     * @returns A list of reviews by the specified user with associated profile and menu item details
     * @throws {InternalServerErrorException} If fetching the user's reviews fails
     */
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