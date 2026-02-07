import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

/**
 * A MenusModule to bundle menu-related functionality.
 * Provides endpoints for menu ingestion and retrieval.
 */
@Module({
    imports: [],
    controllers: [MenusController],
    providers: [MenusService]
})

export class MenusModule {}
