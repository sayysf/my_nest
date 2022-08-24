import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
  } from '@nestjs/websockets';

  import { RunService } from './run.service';

import { Socket } from 'dgram';

  import { Server } from 'socket.io';
import { AppService } from 'src/app.service';
import { IoAdapter } from '@nestjs/platform-socket.io';
  
  @WebSocketGateway({cors: { origin: '*',}})
  export class EventsGateway implements
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{

      private gameUsers : any[] = [];

    @WebSocketServer()
    server: Server;

    handleDisconnect(client: any) {
     
      for (let i :number =  0 ; i < this.gameUsers.length; i++)
      {
        if (client.id == this.gameUsers[i].socket.id)
        {
          this.gameUsers.splice(i, 1);
          break;
        }
      }
      console.log("disconnected = ", client.id);
      

    }
    handleConnection(client: any, ...args: any[]) {
      console.log("connected = " + client.id);
    }
    afterInit(server: any) {
      console.log("init");
    }

    @SubscribeMessage('GAME')
    async gameEvent(client: any, data: any): Promise<string> {
    
        let com = JSON.parse(data);
       this.gameUsers.push({user : com.user, socket: client})
       console.log(this.gameUsers.length)
       while(this.gameUsers.length >= 2)
       {
            
            new RunService(this.gameUsers[0], this.gameUsers[1]);
        
            this.gameUsers.splice(0, 1);
            this.gameUsers.splice(0, 1);
            console.log(this.gameUsers.length)
        }

        return data;
      }

      @SubscribeMessage('HIII')
      async hiiiEvent(client: any, data: any): Promise<string> {  

            console.log(data)
            return data;
        }

    @SubscribeMessage('PRIV')
    async handleEvent(client: any, data: any): Promise<string> {
    
        let com = JSON.parse(data);
       
        if (com.sender != '' && com.target != '')
        {
          //console.log(com)
            this.server.emit(com.target, data);
            return data;
        }
        return undefined;
      }
  }


