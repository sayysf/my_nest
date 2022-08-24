
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { RunService } from './run.service';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {

}