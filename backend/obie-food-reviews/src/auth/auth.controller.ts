import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';

/**
 * AuthController provides authentication-related endpoints.
 * Used to verify that authentication is working correctly.
 */
@Controller()
export class AuthController {
  /**
   * Test endpoint to verify authentication is working.
   * Returns a success response if the Bearer token is valid.
  * @route GET /protected
   * @returns {{ ok: true }} Success indicator
   * @throws UnauthorizedException if Bearer token is missing or invalid
   */
  @UseGuards(SupabaseAuthGuard)
  @Get('/protected')
  protectedRoute() {
    return { ok: true };
  }
}
