import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '@repo/db';
import type { CreateOrderDto, UpdateOrderStatusDto } from '@repo/validators';

@Injectable()
export class OrdersService {
  async create(dto: CreateOrderDto, tenantId: string, userId: string) {
    // Validate all products exist and have enough stock
    const productIds = dto.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, tenantId, active: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found or inactive');
    }

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.id}`,
        );
      }
    }

    const total = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // Create order + decrement stock atomically
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          tenantId,
          userId,
          fulfillmentType: dto.fulfillmentType,
          deliveryAddress: dto.deliveryAddress,
          note: dto.note,
          total,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products.find((p) => p.id === item.productId)!.price,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement stock and write history for each item
      for (const item of dto.items) {
        const product = products.find((p) => p.id === item.productId)!;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            delta: -item.quantity,
            reason: 'SOLD',
            orderId: order.id,
          },
        });
      }

      return order;
    });
  }

  findAll(tenantId: string) {
    return prisma.order.findMany({
      where: { tenantId },
      include: { items: true, user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findMyOrders(userId: string, tenantId: string) {
    return prisma.order.findMany({
      where: { userId, tenantId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const order = await prisma.order.findFirst({
      where: { id, tenantId },
      include: { items: true, user: { select: { id: true, email: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, tenantId: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id, tenantId);

    // Restore stock on cancellation
    if (dto.status === 'CANCELLED') {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (
        order &&
        order.status !== 'CANCELLED' &&
        order.status !== 'COMPLETED'
      ) {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
            await tx.stockHistory.create({
              data: {
                productId: item.productId,
                delta: item.quantity,
                reason: 'CORRECTION',
                orderId: order.id,
              },
            });
          }
          await tx.order.update({
            where: { id },
            data: { status: dto.status },
          });
        });
        return;
      }
    }

    return prisma.order.update({ where: { id }, data: { status: dto.status } });
  }
}
