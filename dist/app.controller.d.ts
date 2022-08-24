import { IndexService } from 'src/index.service';
import { AppService } from "./app.service";
import { Request } from 'express';
import { GameService } from './gameService';
export declare class CatsController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(request: Request, body: Body): string;
    asdfasdf(): object;
    mehmetali(): object;
    kotu(): string;
}
export declare class IndexController {
    private readonly appService;
    constructor(appService: IndexService);
    getHello(): Promise<string>;
}
export declare class GameController {
    private readonly appService;
    constructor(appService: GameService);
    getHello(): Promise<string>;
}
