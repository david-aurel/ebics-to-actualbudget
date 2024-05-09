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
    const transactions: Transaction[] = []
    for (const entry of data.document.bankToCustomerStatement.statement
      .entries) {
      //Batch transactions
      if (entry.entryDetails.transactionDetails.length > 1) {
        entry.entryDetails.transactionDetails.forEach((batchTransaction, i) => {
          const payee = getPayee({ ...entry, transactionDetailIndex: i })
          const notes = getNotes({ ...entry, transactionDetailIndex: i })
          const amount = actualBudget.utils.amountToInteger(
            batchTransaction.amount.value
          )
          transactions.push({
            account: accountId,
            id: batchTransaction.accountServicerReference,
            imported_id: batchTransaction.accountServicerReference,
            date: entry.valueDate,
            payee_name: payee,
            imported_payee: payee,
            amount:
              batchTransaction.creditDebitIndicator === 'debit'
                ? -amount
                : amount,
            cleared: true, // camt053 only includes cleared transactions
            notes,
          })
        })
        continue
      }

      // Single transaction
      const payee = getPayee({ ...entry, transactionDetailIndex: 0 })
      const notes = getNotes({ ...entry, transactionDetailIndex: 0 })
      const amount = actualBudget.utils.amountToInteger(entry.amount.value)
      transactions.push({
        account: accountId,
        id: entry.accountServicerReference,
        imported_id: entry.accountServicerReference,
        date: entry.valueDate,
        payee_name: payee,
        imported_payee: payee,
        amount: entry.creditDebitIndicator === 'debit' ? -amount : amount,
        cleared: true, // camt053 only includes cleared transactions
        notes,
      })
    }

    return transactions
  }
