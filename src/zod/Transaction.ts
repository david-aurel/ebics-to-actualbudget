import { z } from 'zod'

const BaseTransaction = z.object({
  id: z.string().nullish(),
  account: z.string(),
  date: z.string(),
  amount: z.number().nullish(),
  payee: z.string().nullish(),
  payee_name: z.string().nullish(),
  imported_payee: z.string().nullish(),
  category: z.string().nullish(),
  notes: z.string().nullish(),
  imported_id: z.string().nullish(),
  transfer_id: z.string().nullish(),
  cleared: z.boolean().nullish(),
})

export type Transaction = z.infer<typeof BaseTransaction> & {
  subtransactions?: Transaction[] | null
}

export const Transaction: z.ZodType<Transaction> = BaseTransaction.extend({
  subtransactions: z.lazy(() => Transaction.array()).nullable(),
})
