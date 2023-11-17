import { getClient } from './getClient'
import AdmZip from 'adm-zip'
import { parseStringPromise } from 'xml2js'
import { Camt053Schema } from './zod/camt053'

type Response = {
  technicalCode: string
  orderData: Buffer
}

const Client = getClient()

const Day = '2023-10-06' // YYYY-MM-DD
const Order = {
  version: 'h004',
  orderDetails: {
    OrderType: 'Z53',
    OrderAttribute: 'DZHNN',
    StandardOrderParams: {
      DateRange: { Start: Day, End: Day },
    },
  },
  operation: 'download',
}

const main = async () => {
  const response: Response = await Client.send(Order)
  console.log(`Response for ${Order.orderDetails.OrderType} order: `, response)
  if (response.technicalCode !== '000000')
    throw new Error(
      `Something went wrong for ${Order.orderDetails.OrderType} order`
    )
  const zip = new AdmZip(response.orderData)
  const data = await parseStringPromise(
    zip.getEntries()[0]?.getData().toString('utf-8') ?? ''
  )

  const transactions = Camt053Schema.parse(JSON.parse(data))

  // TODO: send transactions to actual-budget
  return transactions
}

void main()
