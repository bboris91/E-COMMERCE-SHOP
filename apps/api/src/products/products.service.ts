import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '@repo/db';
import type {
  CreateProductDto,
  UpdatePriceDto,
  UpdateStockDto,
} from '@repo/validators';

@Injectable()
export class ProductsService {
  findAll(tenantId: string) {
    return prisma.product.findMany({
      where: { tenantId, active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const product = await prisma.product.findFirst({ where: { id, tenantId } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto, tenantId: string) {
    return prisma.product.create({
      data: { ...dto, tenantId },
    });
  }

  async updatePrice(
    id: string,
    tenantId: string,
    dto: UpdatePriceDto,
    changedBy: string,
  ) {
    await this.findOne(id, tenantId);
    return prisma.$transaction([
      prisma.product.update({ where: { id }, data: { price: dto.price } }),
      prisma.priceHistory.create({
        data: { productId: id, price: dto.price, changedBy },
      }),
    ]);
  }

  async updateStock(
    id: string,
    tenantId: string,
    dto: UpdateStockDto,
    changedBy: string,
  ) {
    const product = await this.findOne(id, tenantId);
    const newStock = product.stock + dto.delta;
    if (newStock < 0)
      throw new BadRequestException('Stock cannot go below zero');
    return prisma.$transaction([
      prisma.product.update({ where: { id }, data: { stock: newStock } }),
      prisma.stockHistory.create({
        data: {
          productId: id,
          delta: dto.delta,
          reason: dto.reason,
          changedBy,
        },
      }),
    ]);
  }

  getPriceHistory(id: string, tenantId: string) {
    return this.findOne(id, tenantId).then(() =>
      prisma.priceHistory.findMany({
        where: { productId: id },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async toggleActive(id: string, tenantId: string) {
    const product = await this.findOne(id, tenantId);
    return prisma.product.update({
      where: { id },
      data: { active: !product.active },
    });
  }
}
