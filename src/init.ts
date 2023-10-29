import { Orders } from 'ebics-client'
import { getClient } from './getClient'

type Response = {
  technicalCode: string
}

const Client = getClient()

const main = async () => {
  const INIResponse: Response = await Client.send(Orders.INI)
  console.log(`Response for INI order: `, INIResponse)
  if (INIResponse.technicalCode !== '000000')
    throw new Error('Something went wrong for INI order.')

  const HIAResponse: Response = await Client.send(Orders.INI)
  console.log(`Response for INI order: `, HIAResponse)
  if (HIAResponse.technicalCode !== '000000')
    throw new Error('Something went wrong for HIA order.')

  console.log('Public keys should be sent to bank now.')
}

void main()
