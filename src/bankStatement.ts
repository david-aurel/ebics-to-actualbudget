import { getClient } from './getClient'
import AdmZip from 'adm-zip'
import { parseStringPromise } from 'xml2js'
import { Camt053Schema } from './zod/camt053'
import { camt053ToTransaction } from './camt053ToTransaction'
import { env } from './env'
import { sendTransactions } from './actualBudget'
import { sub, format } from 'date-fns'
import { Transaction } from './zod/Transaction'

type Response = {
  technicalCode: string
  businessCode: string
  orderData: Buffer
}

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
const main = async () => {
  const transactions: Transaction[] = []
  for (const day of days) {
    // The bank responds with an error code if the requests are spaced too close to each other
    if (day !== days[0])
      await new Promise((resolve) => setTimeout(resolve, 500))

    const order = makeOrder(day)
    const response: Response = await Client.send(order)
    console.log(`Response for ${day}`, response)

    if (response.technicalCode !== '000000')
      throw new Error(`Something went wrong for for ${day}`)

    if (response.businessCode === '090005') {
      console.log(`No data for ${day}`)
      continue
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
  }

  if (!transactions.length) {
    console.log(`No data for the past three days of ${days.join(', ')}`)
    return
  }

  await sendTransactions(transactions)
}

void main()
