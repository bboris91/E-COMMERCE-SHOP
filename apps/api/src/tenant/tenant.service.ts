import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/db';
import type { Tenant } from '@repo/db';

@Injectable()
export class TenantService {
  async findBySlug(slug: string): Promise<Tenant> {
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) throw new NotFoundException(`Tenant "${slug}" not found`);
    return tenant;
  }

  async findByDomain(domain: string): Promise<Tenant> {
    const tenant = await prisma.tenant.findUnique({ where: { domain } });
    if (!tenant)
      throw new NotFoundException(`Tenant for domain "${domain}" not found`);
    return tenant;
  }
}
