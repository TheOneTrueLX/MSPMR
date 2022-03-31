import { Module } from '@nestjs/common';
import { EchoService } from './echo.service';
import { EchoGateway } from './echo.gateway';

@Module({
  providers: [EchoGateway, EchoService]
})
export class EchoModule {}
