import { getClient } from './getClient'
import AdmZip from 'adm-zip'
import { parseStringPromise } from 'xml2js'
import { Camt053Schema } from './zod/camt053'
import { camt053ToTransaction } from './camt053ToTransaction'
import { env } from './env'
import { sendTransactions } from './actualBudget'
import { sub, format } from 'date-fns'
import { Transaction } from './zod/Transaction'
import { ResponseSchema } from './zod/Response'

const Client = getClient()

const today = new Date()
const days = [
  format(today, 'yyyy-MM-dd'),
  format(sub(today, { days: 1 }), 'yyyy-MM-dd'),
  format(sub(today, { days: 2 }), 'yyyy-MM-dd'),
]
const makeOrder = (day: string) => ({
  version: 'h004',
  orderDetails: {
    OrderType: 'Z53',
    OrderAttribute: 'DZHNN',
    StandardOrderParams: {
      DateRange: { Start: day, End: day },
    },
  },
  operation: 'download',
})

// Syncs the today and the past two days to Actual Budget
export const bankStatement = async () => {
  const transactions: Transaction[] = []
  for (const day of days) {
    // The bank responds with an error code if the requests are spaced too close to each other
    if (day !== days[0])
      await new Promise((resolve) => setTimeout(resolve, 500))

    const order = makeOrder(day)
    const responseRaw = await Client.send(order)
    const response = ResponseSchema.parse(responseRaw)

    if ('technicalCode' in response && response.technicalCode !== '000000')
      throw new Error(`Something went wrong for for ${day}: ${response}`)

    if ('businessCode' in response && response.businessCode === '090005') {
      console.log(`0 entries for ${day}`)
      continue
    }

    if (!('orderData' in response)) {
      throw new Error(`Something went wrong for for ${day}: ${response}`)
    }

    const zip = new AdmZip(response.orderData)
    const data = await parseStringPromise(
      zip.getEntries()[0]?.getData().toString('utf-8') ?? ''
    )

    const camt053Data = Camt053Schema.parse(data)
    const transactionsFromData = camt053ToTransaction(
      env.ACTUAL_BUDGET_ACCOUNT_ID
    )(camt053Data)

    transactions.push(...transactionsFromData)
    console.log(`${transactionsFromData.length} entries for ${day}`)
  }

  if (!transactions.length) {
    return
  }

  await sendTransactions(transactions)
}

void bankStatement()
