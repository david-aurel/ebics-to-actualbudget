import { BankLetter } from 'ebics-client'
import path from 'path'
import fs from 'fs'
import { getClient } from './getClient'

const main = async () => {
  const Client = await getClient()
  const bankName = Client.bankName

  const template = fs.readFileSync(
    `./src/templates/ini_${Client.languageCode}.hbs`,
    { encoding: 'utf8' }
  )
  const bankLetterFile = path.join(
    './',
    'bankLetter_' + Client.bankShortName + '_' + Client.languageCode + '.html'
  )

  const letter = new BankLetter({ client: Client, bankName, template })

  letter
    .serialize(bankLetterFile)
    .then(() => {
      console.log('Send your bank the letter (%s)', bankLetterFile)
    })
    .catch((err: unknown) => {
      console.error(err)
      process.exit(1)
    })
}
void main()
