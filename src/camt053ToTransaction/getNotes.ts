import { Camt053SchemaType } from '../zod/camt053'

export const getNotes = ({
  entryDetails,
  additionalEntryInfo,
}: Camt053SchemaType['document']['bankToCustomerStatement']['statement']['entries'][0]) => {
  const customRef =
    entryDetails.transactionDetails.remittanceInformation.unstructured ??
    entryDetails.transactionDetails.remittanceInformation.structured
      .creditorReferenceInformation.ref

  return `${additionalEntryInfo}${customRef ? ` (${customRef})` : ''}`
}
