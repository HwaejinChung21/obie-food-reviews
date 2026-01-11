import { Injectable } from '@nestjs/common';
import { supabase } from 'src/lib/supabase.client';

@Injectable()
export class MenusService {

    async fetchMenus() {
        const response = await fetch('https://dish.avifoodsystems.com/api/menu-items/week?date=1/8/2026&locationId=111&mealId=184');

        if (!response.ok) {
            throw new Error('Failed to fetch menus');
        }

        const data = await response.json();
        return data;
        
    }

    async ingestWeekMenus() {

        // Fetch menus from the external API
        // items is an array of menu items
        const items = await this.fetchMenus();
        
        // Hardcoded dining hall and meal for now
        const diningHall = "Stevenson";
        const meal = 'dinner';

        // Grouping items by date
        // We do this because AVI returns a week of items, and our database wants one snapshot per day
        const itemsByDate: Record<string, any[]> = {};

        // extracting the date of the items and grouping them
        for (const item of items) {
            const date = item.date.split('T')[0];

            if (!itemsByDate[date]) {
                itemsByDate[date] = [];
            }

            itemsByDate[date].push(item);
        }

        // loop through each date group and upsert into the database
        for (const [servedDate, dayItems] of Object.entries(itemsByDate)) {
            const { data: snapshot, error: snapshotError } = await supabase
                .from('menu_snapshots')
                // upserting is used to avoid duplicate entries.
                // insert the row if it doesn't exist
                // update if it already exists
                .upsert({
                    dining_hall: diningHall,
                    meal: meal,
                    served_date: servedDate,
                })
                // return the row that now exists
                .select()
                .single();

            if (snapshotError) {
                throw snapshotError;
            }

            // delete old items for this snapshot
            // re-running ingest doesn't duplicate items
            await supabase
                .from('menu_items')
                .delete()
                .eq('snapshot_id', snapshot.id);

            // prepare menu items for insertion
            const menuItems = dayItems.map((item) => ({
                snapshot_id: snapshot.id,
                name: item.name,
                avi_item_id: String(item.id),
            }));

            // insert menu items
            const { error: insertError } = await supabase
                .from('menu_items')
                .insert(menuItems);

            if (insertError) {
                throw insertError;
            }

        }

        return { status: 'ingested' };

        // Process and store the data in your database
        
    }

    async fetchMenusFromDB() {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*');

        if (error) {
            throw error;
        }

        return data;
    }

}