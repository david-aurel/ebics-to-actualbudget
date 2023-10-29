import { Client, fsKeysStorage } from 'ebics-client'
import { env } from './env'

export const getClient = () =>
  new Client({
    url: env.ebicsClient.url,
    partnerId: env.ebicsClient.partnerId,
    userId: env.ebicsClient.userId,
    hostId: env.ebicsClient.hostId,
    passphrase: env.ebicsClient.passphrase,
    keyStorage: fsKeysStorage(env.ebicsClient.keyStorage),
    bankName: env.ebicsClient.bankName,
    bankShortName: env.ebicsClient.bankShortName,
    languageCode: env.ebicsClient.languageCode,
  })
