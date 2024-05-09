import { Camt053SchemaType } from '../zod/camt053'

export const getNotes = ({
  transactionDetailIndex,
  entryDetails,
  additionalEntryInfo,
}: Camt053SchemaType['document']['bankToCustomerStatement']['statement']['entries'][0] & {
  transactionDetailIndex: number
}) => {
  const customRef =
    entryDetails.transactionDetails[transactionDetailIndex]
      ?.remittanceInformation.unstructured ??
    entryDetails.transactionDetails[transactionDetailIndex]
      ?.remittanceInformation.structured.creditorReferenceInformation.ref

  const cleanAdditionalEntryInfo = additionalEntryInfo.replace(
    'Online-Einkauf ZKB Visa Debit Card Nr. xxxx 0193, ',
    ''
  )

  return `${
    customRef
      ? `${customRef} (${cleanAdditionalEntryInfo})`
      : cleanAdditionalEntryInfo
  }`
}
