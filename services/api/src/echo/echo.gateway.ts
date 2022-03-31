import { WebSocketGateway } from '@nestjs/websockets';
import { EchoService } from './echo.service';

@WebSocketGateway()
export class EchoGateway {
  constructor(private readonly echoService: EchoService) {}
}
