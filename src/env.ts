import Env from 'env-var'

export const env = {
  ebicsClient: {
    url: Env.get('EBICS_CLIENT_URL')
      .default('https://ebicsweb.zkb.ch/ebicsweb')
      .asUrlString(),
    partnerId: Env.get('EBICS_CLIENT_PARTNER_ID')
      .example('01234567')
      .required()
      .asString(),
    userId: Env.get('EBICS_CLIENT_USER_ID')
      .example('01234567')
      .required()
      .asString(),
    hostId: Env.get('EBICS_CLIENT_HOST_ID').default('ZKBKCHZZ').asString(),
    passphrase: Env.get('EBICS_CLIENT_PASSPHRASE').required().asString(),
    keyStorage: Env.get('EBICS_CLIENT_KEY_STORAGE')
      .default('ebics_private_key.txt')
      .asString(),
    bankName: Env.get('EBICS_CLIENT_BANK_NAME')
      .default('Zürcher Kantonalbank')
      .asString(),
    bankShortName: Env.get('EBICS_CLIENT_BANK_SHORT_NAME').default('ZKB'),
    languageCode: Env.get('LOCALE')
      .example('en')
      .example('de')
      .example('fr')
      .default('en')
      .asString(),
  },
}
