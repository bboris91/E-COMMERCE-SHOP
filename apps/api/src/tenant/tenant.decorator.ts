import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TenantRequest } from './tenant.middleware';

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenant;
  },
);
