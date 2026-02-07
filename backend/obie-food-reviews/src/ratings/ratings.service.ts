import { BadRequestException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { supabaseAdmin } from 'src/lib/supabase.admin';

/**
 * Handles rating data operations.
 * Manages user ratings for menu items in Supabase, including creating/updating and deleting ratings.
 */
@Injectable()
export class RatingsService {

    /**
     * Creates or updates a rating for a menu item by a specific user.
     * @param params An object containing userId, menuItemId, rating, and an optional description
     * @returns The created or updated rating record
     * @throws {BadRequestException} If the input data violates database constraints (e.g., invalid rating value, foreign key violation)
     * @throws {InternalServerErrorException} If the upsert operation fails for other reasons
     */
    async upsertRating(params: { userId: string; menuItemId: string; rating: number; description?: string }) {
        const { userId, menuItemId, rating, description } = params;

        const { data, error } = await supabaseAdmin
            .from('ratings')
            .upsert(
                {
                    user_id: userId,
                    menu_item_id: menuItemId,
                    rating,
                    description: description ?? null,
                },
                { onConflict: 'user_id,menu_item_id' }
            )
            .select()
            .single();

        if (error?.code === '23514' || error?.code == '23503') {
            console.error('upsertRating constraint error:', error.code, error.message);
            throw new BadRequestException('Failed to upsert rating');
            
        }

        if (error) {
            console.error('upsertRating supabase error:', error);
            throw new InternalServerErrorException('Failed to upsert rating');
        }

        return data;
    }

    /**
     * Deletes a user's rating for a specific menu item.
     * @param userId The ID of the user whose rating is to be deleted
     * @param menuItemId The ID of the menu item for which the rating is to be deleted
     * @throws {InternalServerErrorException} If the delete operation fails
     */
    async deleteRating(userId: string, menuItemId: string,) {
        const { error } = await supabaseAdmin
            .from('ratings')
            .delete()
            .eq('menu_item_id', menuItemId)
            .eq('user_id', userId);
        if (error) {
            throw new InternalServerErrorException('Failed to delete rating');
        }
    }
}