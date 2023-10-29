import { getClient } from './getClient'
import fs from 'fs'

type Response = {
  technicalCode: string
  orderData: Buffer
}

const Client = getClient()

const Order = {
  version: 'h004',
  orderDetails: {
    OrderType: 'Z53',
    OrderAttribute: 'DZHNN',
    StandardOrderParams: {
      DateRange: {
        Start: '2023-09-20', // YYYY-MM-DD
        End: '2023-09-21', // YYYY-MM-DD
      },
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

  const filePath = 'CAMT053.zip'
  const zipStream = fs.createWriteStream(filePath)
  zipStream.write(response.orderData)
  zipStream.end()
}

void main()
