import { Orders } from 'ebics-client'
import { getClient } from './getClient'
import fs from 'fs'

type Response = {
  technicalCode: string
  bankKeys: { bankX002: { mod: Buffer }; bankE002: { mod: Buffer } }
}

const Client = getClient()

// Client keys must be already generated and send by letter.
// The bank should have enabled the user.
const main = async () => {
  const response: Response = await Client.send(Orders.HPB)

  if (response.technicalCode !== '000000')
    throw new Error('Something went wrong for HPB order')

  const data = Buffer.from(response.bankKeys.bankE002.mod)

  console.log('Received bank keys: ', data)
  fs.writeFileSync('ebics_bank_key.txt', data.toString('utf-8'))

  return Client.setBankKeys(response.bankKeys)
}

void main()
