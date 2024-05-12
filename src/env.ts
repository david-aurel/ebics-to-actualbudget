import 'dotenv/config'
import { cleanEnv, str, url } from 'envalid'
import {
  SSMClient,
  DescribeParametersCommand,
  GetParametersCommand,
} from '@aws-sdk/client-ssm'

const AWSRegion = 'eu-central-1'
const baseEnv = cleanEnv(process.env, {})
let AWSParameterStoreValues: Record<string, string> = {}

const getEnv = async () => {
  if (baseEnv.isProd && !Object.values(AWSParameterStoreValues).length) {
    const ssm = new SSMClient({ region: AWSRegion })
    const { Parameters } = await ssm.send(new DescribeParametersCommand())
    const paramNames =
      Parameters?.map(({ Name }) => Name).filter((_): _ is string => !!_) ?? []

    const values = await ssm.send(
      new GetParametersCommand({ Names: paramNames, WithDecryption: true })
    )

    AWSParameterStoreValues =
      values.Parameters?.reduce(
        (acc: Record<string, string>, cur) => ({
          ...acc,
          ...(cur.Name && cur.Value ? { [cur.Name]: cur.Value } : {}),
        }),
        {}
      ) ?? {}
  }

  return cleanEnv(baseEnv.isProd ? process.env : process.env, {
    EBICS_CLIENT_URL: url({ example: 'https://ebicsweb.zkb.ch/ebicsweb' }),
    EBICS_CLIENT_PARTNER_ID: str({ example: '12345678' }),
    EBICS_CLIENT_USER_ID: str({ example: '12345678' }),
    EBICS_CLIENT_HOST_ID: str({ example: 'ZKBKCHZZ' }),
    EBICS_CLIENT_PASSPHRASE: str(),
    EBICS_CLIENT_KEY_STORAGE: str({ default: 'ebics_private_key.txt' }),
    EBICS_CLIENT_BANK_NAME: str({ example: 'Zürcher Kantonalbank' }),
    EBICS_CLIENT_BANK_SHORT_NAME: str({ example: 'ZKB' }),
    EBICS_CLIENT_LANGUAGE_CODE: str({
      default: 'en',
      choices: ['en', 'de', 'fr'],
    }),

    ACTUAL_BUDGET_SERVER_URL: url(),
    ACTUAL_BUDGET_SERVER_PASSWORD: str(),
    ACTUAL_BUDGET_SYNC_ID: str(),
    ACTUAL_BUDGET_ACCOUNT_ID: str(),
  })
}

export { getEnv }
