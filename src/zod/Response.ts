import { z } from 'zod'

export const ResponseSchema = z.object({
  technicalCode: z.string(),
  businessCode: z.string(),
  orderData: z.any(),
})
