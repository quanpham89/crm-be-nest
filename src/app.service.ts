import { Get, Injectable } from '@nestjs/common';
import { Public } from './decorator/customize';

@Injectable()
export class AppService {
  
  @Get()
  @Public()
  getHello(): string {
    return 'Hello World!';
  }
}
