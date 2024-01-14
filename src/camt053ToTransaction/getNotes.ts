import { Camt053SchemaType } from '../zod/camt053'

export const getNotes = ({
  entryDetails,
  additionalEntryInfo,
}: Camt053SchemaType['document']['bankToCustomerStatement']['statement']['entries'][0]) => {
  const customRef =
    entryDetails.transactionDetails.remittanceInformation.unstructured ??
    entryDetails.transactionDetails.remittanceInformation.structured
      .creditorReferenceInformation.ref

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
