import { Controller } from '@nestjs/common';
import { SnackService } from './snack.service';

@Controller('snack')
export class SnackController {
  constructor(private readonly snackService: SnackService) {}
}
