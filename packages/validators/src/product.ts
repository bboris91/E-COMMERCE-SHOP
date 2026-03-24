import { z } from 'zod'

export const CreateProductSchema = z.object({
  sanityId: z.string().min(1),
  price: z.number().int().positive('Price must be a positive number in cents'),
  stock: z.number().int().min(0),
})

export const UpdatePriceSchema = z.object({
  price: z.number().int().positive('Price must be a positive number in cents'),
})

export const UpdateStockSchema = z.object({
  delta: z.number().int(),
  reason: z.enum(['RESTOCK', 'CORRECTION']),
})

export type CreateProductDto = z.infer<typeof CreateProductSchema>
export type UpdatePriceDto = z.infer<typeof UpdatePriceSchema>
export type UpdateStockDto = z.infer<typeof UpdateStockSchema>
