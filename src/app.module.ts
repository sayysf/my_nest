import { Module } from '@nestjs/common';
import { IndexController, CatsController, GameController } from './app.controller';
import { IndexService } from 'src/index.service';
import { AppService } from "./app.service";
import { EventsModule } from 'src/events/events.module';
import { GameModule } from 'src/game/game.module';
import { GameService } from './gameService';

@Module({
  imports: [EventsModule],
  controllers: [IndexController, CatsController, GameController],
  providers: [AppService, IndexService, GameService],
})
export class AppModule {}
