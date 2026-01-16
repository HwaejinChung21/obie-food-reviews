import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { MenusModule } from './menus/menus.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { RatingsModule } from './ratings/ratings.module';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}), MenusModule, ProfilesModule, RatingsModule],
  controllers: [AppController, HealthController, AuthController],
  providers: [AppService],
})
export class AppModule {}
