import { Test, TestingModule } from '@nestjs/testing';
import { EchoGateway } from './echo.gateway';
import { EchoService } from './echo.service';

describe('EchoGateway', () => {
  let gateway: EchoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EchoGateway, EchoService],
    }).compile();

    gateway = module.get<EchoGateway>(EchoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});