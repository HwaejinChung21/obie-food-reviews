import { Injectable } from '@nestjs/common';
import { supabaseAdmin } from 'src/lib/supabase.admin';


type Meal = 'breakfast' | 'lunch' | 'dinner';

/**
 * Handles menu data operations.
 * Fetches menus from the AVI API and manages menu storage in Supabase.
 */
@Injectable()
export class MenusService {

    /**
     * A helper method to get the AVI meal ID from environment variables.
     * @param meal - Meal type ('breakfast', 'lunch', 'dinner')
     * @returns Corresponding meal ID number
     * @throws Error if AVI_MEAL_IDS is missing or meal ID not found
     */
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

    /**
     * A helper method to format a Date object into AVI API date string.
     * @param d - Date object to format
     * @returns Formatted date string in M/D/YYYY format
     */
    private formatAviDate(d: Date) {
        const month = d.getMonth() + 1; // 0-based
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month}/${day}/${year}`; // e.g. "1/11/2026"
    }


    /**
     * Fetch menus from the AVI API for a given meal and date.
     * @param meal - Meal type ('breakfast', 'lunch', 'dinner')
     * @param date - Date for which to fetch menus (default: current date)
     * @returns Menu items fetched from the AVI API
     * @throws Error if AVI_BASE_URL or AVI_LOCATION_ID_STEVENSON is missing
     * @throws Error if fetching menus fails
     */
    async fetchMenus(meal: Meal, date = new Date()) {
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
        return data;
        
    }

    /**
     * Ingests weekly menus from AVI API into the database.
     * Fetches breakfast, lunch, and dinner menus for Stevenson dining hall,
     * groups items by date, and upserts into menu_snapshots and menu_items tables.
     * @returns {{ status: 'ingested' }} Success status object
     * @throws Error if any database operation fails
     */
    async ingestWeekMenus() {
        const meals: Meal[] = ['breakfast', 'lunch', 'dinner'];
        const diningHall = "Stevenson";
        
        for (const meal of meals) {
            const items = await this.fetchMenus(meal, new Date());
            console.log(`Fetched ${items?.length} items for ${meal}`);

            const itemsByDate: Record<string, any[]> = {};
            
            // Group items by date
            for (const item of items) {
                const date = item.date.split('T')[0];

                if (!itemsByDate[date]) {
                    itemsByDate[date] = [];
                }

                itemsByDate[date].push(item);
            }

            // loop through each date group and upsert into the database
            for (const [servedDate, dayItems] of Object.entries(itemsByDate)) {
                const { data: snapshot, error: snapshotError } = await supabaseAdmin
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

                // prepare menu items for insertion
                const menuItems = dayItems.map((item) => ({
                    snapshot_id: snapshot.id,
                    name: item.name,
                    avi_item_id: String(item.id),
                    station_name: item.stationName ?? null
                }));

                //upsert menu items
                const { error: upsertError } = await supabaseAdmin
                    .from('menu_items')
                    .upsert(menuItems, { onConflict: 'snapshot_id,avi_item_id' });

                if (upsertError) throw upsertError;
            }
        }

        return { status: 'ingested' };
    }

    /**
     * A helper method to group menu items by their station names (e.g. Trattoria Dinner, Roots Dinner).
     * @param items Array of menu items to be grouped
     * @returns Array of stations with their corresponding menu items
     */
    private groupByStation(items: any[]) {
        const map = new Map<string, any[]>();

        for (const item of items) {
            const station_name = item.station_name || 'Other';

            if (!map.has(station_name)) {
                map.set(station_name, []);
            }
            map.get(station_name)!.push({
                id: item.id,
                name: item.name,
                aviItemId: item.avi_item_id,
            });
        }

        return Array.from(map.entries()).map(
            ([stationName, items]) => ({
                name: stationName,
                items,
            })
        );
    }

    /**
     * Fetches menu items for a specific dining hall, meal, and date from the database.
     * @param param0 Object containing diningHall, meal, and servedDate
     * @returns Structured menu data including snapshot and stations
     */
    async fetchMenusFromDB({ diningHall, meal, servedDate }: { diningHall: string; meal: string; servedDate: string }) {
        const { data, error } = await supabaseAdmin
            .from('menu_snapshots')
            .select(`
                id,
                dining_hall,
                meal,
                served_date,
                menu_items (
                    id,
                    name,
                    avi_item_id,
                    station_name
                )
            `)
            .eq('dining_hall', diningHall)
            .eq('meal', meal)
            .eq('served_date', servedDate)
            .single();

        if (error) {
            throw error;
        }

        // change the return logic so the the endpoint returns a complete, structured menu
        return {
            snapshot: {
                id: data.id,
                diningHall: data.dining_hall,
                meal: data.meal,
                servedDate: data.served_date,
            },
            stations: this.groupByStation(data.menu_items ?? []),
        };
    }

}