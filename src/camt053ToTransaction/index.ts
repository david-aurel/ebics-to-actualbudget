import Big from 'big.js'

import { Camt053Schema } from '../zod/camt053'
import { Transaction } from '../zod/Transaction'
import { getPayee } from './getPayee'
import { getNotes } from './getNotes'

/**
 * @param data a camt053 object
 * @returns an actual-budget transaction object
 */
export const camt053ToTransaction = (accountId: string) => (data: string) => {
  const bankStatement = Camt053Schema.parse(JSON.parse(data))
  const transactions: Transaction[] =
    bankStatement.document.bankToCustomerStatement.statement.entries.map(
      (entry) => {
        const amount = new Big(entry.amount.value).times(100).toNumber()
        const payee = getPayee(entry)
        const notes = getNotes(entry)
        return {
          // TODO: find out account id
          account: accountId,
          id: entry.accountServicerReference,
          imported_id: entry.accountServicerReference,
          date: entry.bookingDate,
          payee_name: payee,
          imported_payee: payee,
          amount: entry.creditDebitIndicator === 'debit' ? amount : -amount,
          cleared: true, // camt053 only includes cleared transactions
          notes,
        }
      }
    )
  return transactions
}