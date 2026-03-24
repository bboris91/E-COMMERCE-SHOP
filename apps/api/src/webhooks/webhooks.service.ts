import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { prisma } from '@repo/db';

@Injectable()
export class WebhooksService {
  verifySignature(body: string, signature: string, secret: string): boolean {
    const expected = createHmac('sha256', secret).update(body).digest('hex');
    return signature === expected;
  }

  async handleSanityEvent(payload: SanityWebhookPayload, tenantId: string) {
    if (payload._type !== 'product') return { ignored: true };

    const sanityId = payload._id;
    const existing = await prisma.product.findUnique({
      where: { sanityId_tenantId: { sanityId, tenantId } },
    });

    if (!existing) {
      // New product published — create Prisma record with zero price/stock
      // Admin must set price and stock via admin panel before going live
      await prisma.product.create({
        data: { sanityId, tenantId, price: 0, stock: 0, active: false },
      });
      return { created: true };
    }

    return {
      updated: false,
      message: 'Price and stock managed via admin panel only',
    };
  }
}

export interface SanityWebhookPayload {
  _id: string;
  _type: string;
  [key: string]: unknown;
}
