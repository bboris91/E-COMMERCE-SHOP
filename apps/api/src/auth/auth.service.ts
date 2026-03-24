import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '@repo/db';
import type { RegisterDto, LoginDto } from '@repo/validators';
import type { Tenant } from '@repo/db';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async register(dto: RegisterDto, tenant: Tenant) {
    const existing = await prisma.user.findUnique({
      where: { email_tenantId: { email: dto.email, tenantId: tenant.id } },
    });
    if (existing) throw new ConflictException('Email already registered');

    const password = await bcrypt.hash(dto.password, 12);
    const user = await prisma.user.create({
      data: { email: dto.email, password, tenantId: tenant.id },
    });

    return { token: this.signToken(user.id, tenant.id, user.role) };
  }

  async login(dto: LoginDto, tenant: Tenant) {
    const user = await prisma.user.findUnique({
      where: { email_tenantId: { email: dto.email, tenantId: tenant.id } },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { token: this.signToken(user.id, tenant.id, user.role) };
  }

  private signToken(userId: string, tenantId: string, role: string) {
    return this.jwt.sign({ sub: userId, tenantId, role });
  }
}
