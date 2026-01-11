import { Controller, Get } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('/menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Get('avi')
    getMenus() {
        return this.menusService.fetchMenus();
    }

    @Get('ingest')
    async ingestMenus() {
        return this.menusService.ingestWeekMenus();
    }

    @Get()
    async fetchMenusFromDB() {
        return this.menusService.fetchMenusFromDB();
    }
}