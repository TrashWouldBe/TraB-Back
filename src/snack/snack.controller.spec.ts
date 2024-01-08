import { Test, TestingModule } from '@nestjs/testing';
import { SnackController } from './snack.controller';

describe('SnackController', () => {
  let controller: SnackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnackController],
    }).compile();

    controller = module.get<SnackController>(SnackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
