import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

/**
 * A ProfilesModule to bundle profile-related functionality.
 * Provides endpoints for profile management.
 */
@Module({
    imports: [],
    controllers: [ProfilesController],
    providers: [ProfilesService]
})

export class ProfilesModule {}