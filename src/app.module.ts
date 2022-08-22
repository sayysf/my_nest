import { Module } from '@nestjs/common';
import { AppController, CatsController } from './app.controller';
import { IndexService } from './index.service';
import { AppService } from "./app.service";
import { EventsModule } from 'events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [AppController, CatsController],
  providers: [AppService, IndexService],
})
export class AppModule {}
