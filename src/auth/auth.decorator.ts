import { applyDecorators, UseGuards } from '@nestjs/common';
import { JWTGuard } from './auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(JWTGuard));
}
