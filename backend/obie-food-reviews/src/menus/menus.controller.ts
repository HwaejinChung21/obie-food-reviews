import { BadRequestException, Controller, Get, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { MenusService } from './menus.service';

@Controller('/menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Post('ingest')
    async ingestMenus(@Req() req: Request) {
        const auth = req.headers.authorization ?? '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

        if (token !== process.env.INGEST_SECRET) {
            throw new UnauthorizedException('Bad ingest secret');
        }

        return this.menusService.ingestWeekMenus();
    }

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
}