import {
  Controller,
  Post,
  Headers,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
import { CurrentTenant } from '../tenant/tenant.decorator';
import type { Tenant } from '@repo/db';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('sanity')
  handleSanity(
    @Headers('sanity-webhook-signature') signature: string,
    @Req() req: Request & { rawBody?: Buffer },
    @Body() payload: unknown,
    @CurrentTenant() tenant: Tenant,
  ) {
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    if (secret) {
      const rawBody = req.rawBody?.toString() ?? JSON.stringify(payload);
      const valid = this.webhooksService.verifySignature(
        rawBody,
        signature,
        secret,
      );
      if (!valid) throw new UnauthorizedException('Invalid webhook signature');
    }
    return this.webhooksService.handleSanityEvent(payload as never, tenant.id);
  }
}
