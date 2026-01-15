import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { MenusModule } from './menus/menus.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { ProfilesController } from './profiles/profiles.controller';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}), MenusModule],
  controllers: [AppController, HealthController, AuthController, ProfilesController],
  providers: [AppService],
})
export class AppModule {}
