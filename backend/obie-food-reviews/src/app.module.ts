import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { MenusModule } from './menus/menus.module';


@Module({
  imports: [MenusModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
