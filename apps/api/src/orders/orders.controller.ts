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
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentTenant } from '../tenant/tenant.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateOrderSchema, UpdateOrderStatusSchema } from '@repo/validators';
import type { CreateOrderDto, UpdateOrderStatusDto } from '@repo/validators';
import type { Tenant, User } from '@repo/db';

interface AuthRequest extends Request {
  user: User;
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateOrderSchema)) dto: CreateOrderDto,
    @CurrentTenant() tenant: Tenant,
    @Request() req: AuthRequest,
  ) {
    return this.ordersService.create(dto, tenant.id, req.user.id);
  }

  // Admin: all orders for this tenant
  @Get()
  @UseGuards(AdminGuard)
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.ordersService.findAll(tenant.id);
  }

  // Customer: their own orders
  @Get('my')
  findMine(@CurrentTenant() tenant: Tenant, @Request() req: AuthRequest) {
    return this.ordersService.findMyOrders(req.user.id, tenant.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
    return this.ordersService.findOne(id, tenant.id);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderStatusSchema))
    dto: UpdateOrderStatusDto,
    @CurrentTenant() tenant: Tenant,
  ) {
    return this.ordersService.updateStatus(id, tenant.id, dto);
  }
}
