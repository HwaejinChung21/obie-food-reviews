import { BadRequestException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { supabaseAdmin } from 'src/lib/supabase.admin';

@Injectable()
export class RatingsService {
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
            throw new BadRequestException('Failed to upsert rating');
        }

        if (error) {
            throw new InternalServerErrorException('Failed to upsert rating');
        }

        return data;
    }

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