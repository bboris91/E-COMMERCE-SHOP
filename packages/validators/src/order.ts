import { z } from 'zod'

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
})

export const CreateOrderSchema = z.object({
  fulfillmentType: z.enum(['PICKUP', 'DELIVERY']),
  deliveryAddress: z.string().min(1).optional(),
  note: z.string().optional(),
  items: z.array(OrderItemSchema).min(1),
}).refine(
  (data) => data.fulfillmentType === 'PICKUP' || !!data.deliveryAddress,
  { message: 'Delivery address is required for delivery orders', path: ['deliveryAddress'] }
)

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED']),
})

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>
