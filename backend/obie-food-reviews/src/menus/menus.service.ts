import { Injectable } from '@nestjs/common';

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
}