import { AppService } from './app.service';
import { Request } from 'express';
export declare class CatsController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(request: Request, body: Body): string;
    asdfasdf(): object;
    mehmetali(): object;
    kotu(): string;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
}
