import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private gameUsers;
    server: Server;
    handleDisconnect(client: any): void;
    handleConnection(client: any, ...args: any[]): void;
    afterInit(server: any): void;
    gameEvent(client: any, data: any): Promise<string>;
    hiiiEvent(client: any, data: any): Promise<string>;
    handleEvent(client: any, data: any): Promise<string>;
}
