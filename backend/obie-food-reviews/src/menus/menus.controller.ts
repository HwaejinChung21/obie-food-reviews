import { Controller, Get } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('/menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Get()
    getMenus() {
        return this.menusService.fetchMenus();
    }

    @Get('ingest')
    async ingestMenus() {
        return this.menusService.ingestWeekMenus();
    }
}