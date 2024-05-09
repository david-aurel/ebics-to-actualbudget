import { Camt053SchemaType } from '../zod/camt053'

export const getPayee = ({
  transactionDetailIndex,
  entryDetails,
  cardTransaction,
  additionalEntryInfo,
  creditDebitIndicator,
}: Camt053SchemaType['document']['bankToCustomerStatement']['statement']['entries'][0] & {
  transactionDetailIndex: number
}) => {
  const transferCreditor =
    entryDetails.transactionDetails[transactionDetailIndex]?.relatedParties
      .creditor
  const transferDebtor =
    entryDetails.transactionDetails[transactionDetailIndex]?.relatedParties
      .debtor
  const cardMerchant = cardTransaction.poi
  const creditorFromNote = additionalEntryInfo.startsWith('Belastung TWINT: ')
    ? additionalEntryInfo.replace('Belastung ', '')
    : undefined
  const debtorFromNote = additionalEntryInfo.startsWith('Gutschrift')
    ? additionalEntryInfo.replace(/^Gutschrift(: )?/, '')
    : undefined

  const payee =
    creditDebitIndicator === 'debit'
      ? transferCreditor?.name ??
        transferCreditor?.addressLine?.join(' ') ??
        cardMerchant ??
        creditorFromNote
      : transferDebtor?.name ??
        transferDebtor?.addressLine?.join(' ') ??
        cardMerchant ??
        debtorFromNote

  return payee
}
