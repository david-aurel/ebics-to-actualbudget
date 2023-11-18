import { Camt053SchemaType } from '../zod/camt053'

export const getPayee = ({
  entryDetails,
  cardTransaction,
  additionalEntryInfo,
  creditDebitIndicator,
}: Camt053SchemaType['document']['bankToCustomerStatement']['statement']['entries'][0]) => {
  const transferCreditor =
    entryDetails.transactionDetails.relatedParties.creditor
  const transferDebtor = entryDetails.transactionDetails.relatedParties.debtor
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
