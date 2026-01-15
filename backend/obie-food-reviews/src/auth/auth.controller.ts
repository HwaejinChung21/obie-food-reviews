import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Controller()
export class AuthController {
  @UseGuards(SupabaseAuthGuard)
  @Get('/protected')
  protectedRoute() {
    return { ok: true };
  }
}
