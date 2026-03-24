import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentTenant } from '../tenant/tenant.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateProductSchema,
  UpdatePriceSchema,
  UpdateStockSchema,
} from '@repo/validators';
import type {
  CreateProductDto,
  UpdatePriceDto,
  UpdateStockDto,
} from '@repo/validators';
import type { Tenant, User } from '@repo/db';

interface AuthRequest extends Request {
  user: User;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.productsService.findAll(tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.productsService.findOne(id, tenant.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(
    @Body(new ZodValidationPipe(CreateProductSchema)) dto: CreateProductDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.productsService.create(dto, tenant.id);
  }

  @Put(':id/price')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updatePrice(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePriceSchema)) dto: UpdatePriceDto,
    @CurrentTenant() tenant: Tenant,
    @Request() req: AuthRequest,
  ) {
    return this.productsService.updatePrice(id, tenant.id, dto, req.user.id);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateStock(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateStockSchema)) dto: UpdateStockDto,
    @CurrentTenant() tenant: Tenant,
    @Request() req: AuthRequest,
  ) {
    return this.productsService.updateStock(id, tenant.id, dto, req.user.id);
  }

  @Get(':id/price-history')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getPriceHistory(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.productsService.getPriceHistory(id, tenant.id);
  }

  @Put(':id/toggle')
  @UseGuards(JwtAuthGuard, AdminGuard)
  toggleActive(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.productsService.toggleActive(id, tenant.id);
  }
}
