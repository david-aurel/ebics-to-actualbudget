// Actual Budget doesn't use EMS yet
// eslint-disable-next-line @typescript-eslint/no-var-requires
const actualBudget = require('@actual-app/api')
import { Camt053SchemaType } from '../zod/camt053'
import { Transaction } from '../zod/Transaction'
import { getPayee } from './getPayee'
import { getNotes } from './getNotes'

/**
 * @param data a camt053 object
 * @returns an actual-budget transaction object
 */
export const camt053ToTransaction =
  (accountId: string) => (data: Camt053SchemaType) => {
    const transactions: Transaction[] =
      data.document.bankToCustomerStatement.statement.entries.map((entry) => {
        const amount = actualBudget.utils.amountToInteger(entry.amount.value)
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
          amount: entry.creditDebitIndicator === 'debit' ? -amount : amount,
          cleared: true, // camt053 only includes cleared transactions
          notes,
        }
      })
    return transactions
  }
