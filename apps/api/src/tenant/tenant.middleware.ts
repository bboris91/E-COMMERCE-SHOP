import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import type { Tenant } from '@repo/db';

export interface TenantRequest extends Request {
  tenant: Tenant;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const slug = req.headers['x-tenant'] as string;
    if (!slug) throw new BadRequestException('Missing X-Tenant header');
    const tenant = await this.tenantService.findBySlug(slug);
    (req as TenantRequest).tenant = tenant;
    next();
  }
}
