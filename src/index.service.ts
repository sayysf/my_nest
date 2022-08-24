import { Injectable } from '@nestjs/common';
import { open, read, readFile, readFileSync } from 'fs';

@Injectable()
export class IndexService {
  getRes(): string {
    return readFileSync(__dirname +"/../index.html").toString();
  }
}

