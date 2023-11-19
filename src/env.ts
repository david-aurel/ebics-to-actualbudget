import 'dotenv/config'
import { cleanEnv, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
  EBICS_CLIENT_URL: url({ default: 'https://ebicsweb.zkb.ch/ebicsweb' }),
  EBICS_CLIENT_PARTNER_ID: str({ example: '12345678' }),
  EBICS_CLIENT_USER_ID: str({ example: '12345678' }),
  EBICS_CLIENT_HOST_ID: str({ default: 'ZKBKCHZZ' }),
  EBICS_CLIENT_PASSPHRASE: str(),
  EBICS_CLIENT_KEY_STORAGE: str({ default: 'ebics_private_key.txt' }),
  EBICS_CLIENT_BANK_NAME: str({ default: 'Zürcher Kantonalbank' }),
  EBICS_CLIENT_BANK_SHORT_NAME: str({ default: 'ZKB' }),
  EBICS_CLIENT_LANGUAGE_CODE: str({
    default: 'en',
    choices: ['en', 'de', 'fr'],
  }),

  ACTUAL_BUDGET_SERVER_URL: url(),
  ACTUAL_BUDGET_SERVER_PASSWORD: str(),
  ACTUAL_BUDGET_SYNC_ID: str(),
  ACTUAL_BUDGET_ACCOUNT_ID: str(),
})
