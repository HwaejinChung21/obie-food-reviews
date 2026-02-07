import { BadRequestException, Controller, Get, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { MenusService } from './menus.service';

/**
 * A MenusController to handle menu-related endpoints.
 * Provides routes to ingest menus and fetch menus from the database.
 */
@Controller('/menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    /**
     * Fetch menu items for a specific dining hall, meal, and date.
     * @param hall - Dining hall name (e.g., "Stevenson", "Lord-Saunders")
     * @param meal - Meal type (e.g., "Breakfast", "Lunch", "Dinner")
     * @param date - Date in YYYY-MM-DD format
     * @returns Array of menu items matching the criteria
     * @throws BadRequestException if hall, meal, or date is missing
     * @route GET /menus
     */
    @Get()
    async fetchMenusFromDB(
        @Query('hall') hall: string,
        @Query('meal') meal: string,
        @Query('date') date: string,
    ) {
        if (!hall || !meal || !date) {
            throw new BadRequestException('Missing query parameters: hall, meal, date are required');
        }

        return this.menusService.fetchMenusFromDB({diningHall: hall, meal, servedDate: date});
    }

    /**
     * Ingest weekly menus from external source into the database.
     * Protected endpoint - requires valid INGEST_SECRET token.
     * @param req - Express request with Authorization header
     * @returns Ingested menu data
     * @throws UnauthorizedException if Bearer token doesn't match INGEST_SECRET
     * @route POST /menus/ingest
     */
    @Post('ingest')
    async ingestMenus(@Req() req: Request) {
        const auth = req.headers.authorization ?? '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

        if (token !== process.env.INGEST_SECRET) {
            throw new UnauthorizedException('Bad ingest secret');
        }

        return this.menusService.ingestWeekMenus();
    }
}