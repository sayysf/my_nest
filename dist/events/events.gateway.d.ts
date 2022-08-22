import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    server: Server;
    handleDisconnect(client: any): void;
    handleConnection(client: any, ...args: any[]): void;
    afterInit(server: any): void;
    handleEvent(client: any, data: any): Promise<string>;
}
