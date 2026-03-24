import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { CurrentTenant } from '../tenant/tenant.decorator';
import { RegisterSchema, LoginSchema } from '@repo/validators';
import type { RegisterDto, LoginDto } from '@repo/validators';
import type { Tenant } from '@repo/db';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  register(@Body() dto: RegisterDto, @CurrentTenant() tenant: Tenant) {
    return this.authService.register(dto, tenant);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() dto: LoginDto, @CurrentTenant() tenant: Tenant) {
    return this.authService.login(dto, tenant);
  }
}
