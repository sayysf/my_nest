
 // import { Injectable } from '@nestjs/common';
 // @Injectable()

 import { IoAdapter } from "@nestjs/platform-socket.io";
import { WebSocketGateway } from "@nestjs/websockets";

import { Server } from "socket.io";

//import { io } from "socket.io-client";

import { WebSocket } from "ws";
import { io } from "socket.io-client";
import { DESTRUCTION } from "dns";

//import { Socket } from "dgram";
import { Socket } from "net";


async function sleep(ms: number) {
    return  await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

const DIRECTION = {
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
    IDLE: 0
  }



   let Ball =  {
    new: function () {
      return {
        size: 10,
        x: (this.canvas.width / 2 - 5),
        y: (this.canvas.height / 2 - 5),
        xMove: DIRECTION.IDLE,
        yMove: DIRECTION.IDLE,
        speed:  4// speedMeUp || 4
      }
    }
  };

  let Paddle = {
    new: function (side) {
      return {
        height: 100,
        width: 20,
        x: side === 'left' ? 70 : 910,
        y: 200,
        score: 0,
        move: 0,
        speed: 10
      }
    }
  }

 const Canvas : object =  {
    height : 0,
    width : 0,
}




export class RunService {
   

        private user1: any;
        private user2: any;
        private socket: any;
        private ball : any;
        private over: boolean;

        private game_id :string;
    
        private gamer1  :  any;
        private gamer2  :  any;
        private socket_flag : any;

        public canvas : any;
       
       /* ca_nvas = {
            width : 0,
            height : 0,
        }
        */
        private round : any;

    constructor(user1: any, user2: any)
    {
        this.game_id = this.getMyId();

        this.user1 = user1;
        this.user2 = user2;
        this.canvas = Canvas;
        this.socket =  io("ws://localhost:3000");
        this.gamer1  =  Paddle.new("left");
        this.gamer2  =  Paddle.new("right");
        this.canvas.width = 1000;
       this.canvas.height = 500;
       this.round = 0;
       this.socket_flag = 0;

       this.ball = Ball.new.call(this);
        this.run()
        
    }

    getMyId():string{
        return Math.random().toString(36).substring(2,7);
     }

   async run()
    {

        this.user1.socket.emit("GAME", this.game_id);
        this.user2.socket.emit("GAME", this.game_id);

        this.socket.on(this.game_id,(data) =>
        {
            let com = JSON.parse(data);
            if (com.sender === this.user1.user)
            {
                if (com.data === DIRECTION.UP)
                    this.gamer1.move = DIRECTION.UP;
                else if (com.data === DIRECTION.DOWN)
                 this.gamer1.move = DIRECTION.DOWN;
                else if (com.data === DIRECTION.IDLE)
                 this.gamer1.move = DIRECTION.IDLE;
            }
           else if (com.sender === this.user2.user)
            {
                if (com.data === DIRECTION.UP)
                    this.gamer2.move = DIRECTION.UP;
                else if (com.data === DIRECTION.DOWN)
                    this.gamer2.move = DIRECTION.DOWN;
                else if (com.data === DIRECTION.IDLE)
                    this.gamer2.move = DIRECTION.IDLE;      
            }
        })

        this.user1.socket.on('disconnect', () => {
            console.log("gamer = ", this.user1.user);
            this.socket_flag = this.user1.user;
          });
        this.user2.socket.on('disconnect', () => {
            console.log("gamer = ", this.user2.user);
            this.socket_flag = this.user2.user;
          });

        while(!this.socket_flag)
        {
           await sleep(25);


            if (!this.over) {
                    if (this.ball.yMove === DIRECTION.IDLE) {
                    this._newRound.call(this, this.gamer1);
                }
                //
                if (this.ball.x - this.ball.size <= 0) this._newRound.call(this, this.gamer2, this.gamer1);
    
                //Moving up/down, gamer1 updated by listeners
                if (this.gamer1.move === DIRECTION.UP) this.gamer1.y -= this.gamer1.speed;
                else if (this.gamer1.move === DIRECTION.DOWN) this.gamer1.y += this.gamer1.speed;
               
                if (this.gamer2.move === DIRECTION.UP) this.gamer2.y -= this.gamer2.speed;
                else if (this.gamer2.move === DIRECTION.DOWN) this.gamer2.y += this.gamer2.speed;
    
                //gamer1 and gamer2 collision with wall
                if (this.gamer1.y <= 0) this.gamer1.y = 0;
                else if (this.gamer1.y >= (this.canvas.height - this.gamer1.height)) this.gamer1.y = (this.canvas.height - this.gamer1.height);
                if (this.gamer2.y >= this.canvas.height - this.gamer2.height) this.gamer2.y = this.canvas.height - this.gamer2.height;
                else if (this.gamer2.y <= 0) this.gamer2.y = 0;
    
                //Move in Y - BALL
                if (this.ball.y <= 0) { this.ball.yMove = DIRECTION.DOWN; }
                else if (this.ball.y >= this.canvas.height - this.ball.size) { this.ball.yMove = DIRECTION.UP; }
                if (this.ball.yMove === DIRECTION.DOWN) this.ball.y += this.ball.speed / 2 + Math.random() * (2 - 0.2);
                else if (this.ball.yMove === DIRECTION.UP) this.ball.y -= this.ball.speed / 2 + Math.random() * (2 - 0.2);
    
                //Move in X - BALL
                if (this.ball.x <= 0) {
                this._newRound.call(this, this.gamer2);
                }
                else if (this.ball.x >= this.canvas.width + this.ball.size) {
                this._newRound.call(this, this.gamer1);
                }
                if (this.ball.xMove === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
                else if (this.ball.xMove === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            
                //BALL - gamer1 COLLISION
                //1. Check ball x position with gamer1 x position and ball y position with gamer1 y position
                if (this.ball.x <= this.gamer1.x + this.gamer1.width && this.gamer1.y <= this.ball.y + this.ball.size) {
                    //2. If true check that ball not have x position less than gamer1.
                    if (this.ball.x - this.ball.size >= this.gamer1.x) {
                        //3. If true check that ball is in gamer1 paddel range.
                        if (this.gamer1.y + this.gamer1.height >= this.ball.y - this.ball.size) {
                        //4. If true chech that is upper paddel.
                        if (this.ball.y <= this.gamer1.y + this.gamer1.height / 2) {
                            this.ball.xMove = DIRECTION.RIGHT;
                          //  this.ball.yMove = DIRECTION.UP;
                            this.ball.speed += Math.random() * (1 - 0.2) + 0.2;
                            //5. If false check for lower paddel.
                        } else if (this.ball.y >= this.gamer1.y + this.gamer1.height / 2) {
                            this.ball.xMove = DIRECTION.RIGHT;
                           // this.ball.yMove = DIRECTION.DOWN;
                            this.ball.speed += Math.random() * (1 - 0.2) + 0.2;
                        }
                        }
                    }
                }
    
                //BALL - gamer2 COLLISION
                //1. Check ball x position with gamer1 x position and ball y position with gamer1 y position
                if (this.ball.x >= this.gamer2.x - this.gamer2.width && this.gamer2.y <= this.ball.y + this.ball.size) {
                    //2. If true check that ball not have x position less than gamer2.
                    if (this.ball.x + this.ball.size <= this.gamer2.x) {
                        //3. If true check that ball is in gamer2 paddel range.
                        if (this.gamer2.y + this.gamer2.height >= this.ball.y - this.ball.size) {
                        //4. If true chech that is upper paddel.
                        if (this.ball.y <= this.gamer2.y + this.gamer2.height / 2) {
                            this.ball.xMove = DIRECTION.LEFT;
                           // this.ball.yMove = DIRECTION.UP;
                            this.ball.speed += .2;

                            //5. If false check for lower paddel.
                        } else if (this.ball.y >= this.gamer2.y + this.gamer2.height / 2) 
                        {
                            this.ball.xMove = DIRECTION.LEFT;
                          //  this.ball.yMove = DIRECTION.DOWN;
                            this.ball.speed += .2;                 
                        }
                        
                        }
                    }
                }
    
                //End game
                if (this.gamer2.score === 20 || this.gamer1.score === 20) {
                        if (this.gamer2.score === 20) {
                            this.over = true
                           break;
                    }
                    else if (this.gamer1.score === 20) {
                        this.over = true

                        break;
                    }
                }
            }
            
            this.user1.socket.emit("DATA", {
                ball: this.ball,
                gamer1: this.gamer1,
                gamer2 : this.gamer2,
                round: this.round,
                over :this.over,
                
            });
            this.user2.socket.emit("DATA", {
                ball: this.ball,
                gamer1: this.gamer1,
                gamer2 : this.gamer2,
                round: this.round,
                over :this.over,
            });
        }
        this.socket.disconnect();
    }

    _newRound(winner){
            this.ball = Ball.new.call(this);
            let i ;
            
            i =  Math.floor(Math.random() * 2);
            if (i == 1)
                this.ball.xMove = DIRECTION.LEFT;
            else
                this.ball.xMove = DIRECTION.RIGHT;
            i = Math.floor(Math.random() * 2);
            if (i == 1)
                this.ball.yMove = DIRECTION.UP;
            else
                this.ball.yMove = DIRECTION.DOWN;

            //If it is start - clear scores.
            if (this.round === 0) {
                this.gamer1.score = 0;
                this.gamer2.score = 0;
                winner.score = 0;
                this.round += 1;
            }
            else {
                winner.score += 1;
                this.round += 1;
            }
            }
    

        getHello(): string {
        return 'Hello World!';
    }
    
  }