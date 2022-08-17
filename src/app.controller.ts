import { Body, Controller, Get, HttpCode, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request, @Body() body: Body): string {
    console.log(request.body)
    return 'Hello';
  }

  @Get('mehmet')
  asdfasdf(): object {
    return {name: 'mehmet', age: 31};
  }

  @Get('test')
  mehmetali(): object {
    return {name: 'ali', age: 31};
  }

  @Get('kotu')
  @HttpCode(400)
  kotu(): string {
    return 'This is bad';
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return '<h1>hello!</h1>';
  }
}
