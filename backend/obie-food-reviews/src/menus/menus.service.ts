import { Injectable } from '@nestjs/common';
import { supabase } from 'src/lib/supabase.client';

type Meal = 'breakfast' | 'lunch' | 'dinner';

@Injectable()
export class MenusService {

    private getMealId(meal: Meal): number {
        const raw = process.env.AVI_MEAL_IDS;
        if (!raw) throw new Error('Missing AVI_MEAL_IDS');

        const map = JSON.parse(raw) as Record<string, number>;
        const id = map[meal];

        if (!id) {
        throw new Error(`Missing mealId for ${meal}`);
        }

        return id;
    }

    private formatAviDate(d: Date) {
        const month = d.getMonth() + 1; // 0-based
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month}/${day}/${year}`; // e.g. "1/11/2026"
    }


    async fetchMenus(date = new Date(), meal: Meal) {
        const aviDate = this.formatAviDate(date);
        const mealId = this.getMealId(meal);
        const base = process.env.AVI_BASE_URL;
        const locationId = process.env.AVI_LOCATION_ID_STEVENSON;

        if (!base || !locationId) {
            throw new Error('Missing AVI_BASE_URL or AVI_LOCATION_ID_STEVENSON');
        }

        const url = `${base}/api/menu-items/week?date=${encodeURIComponent(aviDate)}&locationId=${encodeURIComponent(locationId)}&mealId=${encodeURIComponent(String(mealId))}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch menus');
        }

        const data = await response.json();
        const raw = JSON.stringify(data);
        const hash = require('crypto').createHash('sha256').update(raw).digest('hex');
        return data;
        
    }

    async ingestWeekMenus() {
        const meals: Meal[] = ['breakfast', 'lunch', 'dinner'];
        const diningHall = "Stevenson";
        
        for (const meal of meals) {
            const mealId = this.getMealId(meal);
            const items = await this.fetchMenus(new Date(), meal);

            const itemsByDate: Record<string, any[]> = {};
        
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
                    .upsert(
                        {
                            dining_hall: diningHall,
                            meal: meal,
                            served_date: servedDate,
                        },
                        { onConflict: 'dining_hall,meal,served_date' }
                    )
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
        }

        return { status: 'ingested' };
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