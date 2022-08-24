import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class GameService {
  getRes(): string {
    return readFileSync(__dirname + "/../game.html").toString();
  }
}
