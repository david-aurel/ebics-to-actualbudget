import { Client, fsKeysStorage } from 'ebics-client'
import { getEnv } from './env'

export const getClient = async () => {
  const env = await getEnv()
  return new Client({
    url: env.EBICS_CLIENT_URL,
    partnerId: env.EBICS_CLIENT_PARTNER_ID,
    userId: env.EBICS_CLIENT_USER_ID,
    hostId: env.EBICS_CLIENT_HOST_ID,
    passphrase: env.EBICS_CLIENT_PASSPHRASE,
    keyStorage: fsKeysStorage(env.EBICS_CLIENT_KEY_STORAGE),
    bankName: env.EBICS_CLIENT_BANK_NAME,
    bankShortName: env.EBICS_CLIENT_BANK_SHORT_NAME,
    languageCode: env.EBICS_CLIENT_LANGUAGE_CODE,
  })
}
