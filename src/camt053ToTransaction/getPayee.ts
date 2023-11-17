import { Camt053SchemaType } from '../zod/camt053'

export const getPayee = ({
  details,
  cardTransaction,
  additionalEntryInfo,
  creditDebitIndicator,
}: Camt053SchemaType['entries'][0]) => {
  const transferCreditor = details.relatedParties.creditor
  const transferDebtor = details.relatedParties.debtor
  const cardMerchant = cardTransaction.poi
  const creditorFromNote = additionalEntryInfo.startsWith('Belastung TWINT: ')
    ? additionalEntryInfo.replace('Belastung ', '')
    : undefined
  const debtorFromNote = additionalEntryInfo.startsWith('Gutschrift')
    ? additionalEntryInfo.replace(/^Gutschrift(: )?/, '')
    : undefined

  const payee =
    creditDebitIndicator === 'debit'
      ? transferCreditor.name ??
        transferCreditor.addressLine?.join(' ') ??
        cardMerchant ??
        creditorFromNote
      : transferDebtor.name ??
        transferDebtor.addressLine?.join(' ') ??
        cardMerchant ??
        debtorFromNote

  return payee
}
