import { z } from 'zod'
import { booleanFromString, fromArray } from '../utils'

const RelatedPartySchema = z.object({
  // Name
  Nm: fromArray(z.string()).nullish(),
  // Postal Address
  PstlAdr: fromArray(
    z.object({ AdrLine: z.array(z.string()).nullish() }).nullish()
  ).nullish(),
})

export const Camt053Schema = z
  .object({
    Document: z.object({
      // Bank-to-Customer Statement
      BkToCstmrStmt: fromArray(
        z.object({
          // Statement (Report on balances and transactions on an account)
          Stmt: fromArray(
            z.object({
              // Entry Array (Transactions)
              Ntry: z
                .array(
                  z.object({
                    // Amount and currency
                    Amt: fromArray(
                      z.object({
                        _: z.string(), // amount
                        $: z.object({
                          Ccy: z.string(), // currency
                        }),
                      })
                    ),

                    // Indicator of credit or debit entry
                    CdtDbtInd: fromArray(
                      z.union([
                        z.literal('CRDT').transform(() => 'credit' as const),
                        z.literal('DBIT').transform(() => 'debit' as const),
                      ])
                    ),

                    // Reversal Indicator (true if the entry is a return or refund)
                    RvslInd: fromArray(booleanFromString),

                    // Value Date (when the transaction was initiated)
                    ValDt: fromArray(
                      z.object({
                        Dt: z.array(z.string()).nonempty().max(1), // YYYY-MM-DD
                      })
                    ),

                    // Booking Date (when the transaction was completed)
                    BookgDt: fromArray(
                      z.object({
                        Dt: fromArray(z.string()), // YYYY-MM-DD
                      })
                    ),

                    // Account Servicer Reference
                    // Unique reference for the entry, assigned by the financial institution,
                    // which is used for duplicate checking
                    AcctSvcrRef: fromArray(z.string()),

                    // Additional Entry Information (i.e. a custom note)
                    AddtlNtryInf: fromArray(z.string()),

                    // Card Transaction (Only provided if the transaction was made by card)
                    CardTx: fromArray(
                      z.object({
                        // Point of Interaction (THe place where the card payment was made)
                        POI: fromArray(
                          z.object({
                            Id: fromArray(
                              z.object({
                                // Usually this is the name of the company / merchant
                                Id: fromArray(z.string()),
                              })
                            ),
                          })
                        ),
                      })
                    ).nullish(),

                    // Entry Details
                    NtryDtls: fromArray(
                      z.object({
                        // Transaction Details
                        TxDtls: fromArray(
                          z.object({
                            // Related Parties
                            RltdPties: fromArray(
                              z.object({
                                // Debtor
                                Dbtr: fromArray(RelatedPartySchema).nullish(),
                                // Creditor
                                Cdtr: fromArray(RelatedPartySchema).nullish(),
                              })
                            ),
                          })
                        ),
                      })
                    ).nullish(),
                  })
                )
                .nullish(),
            })
          ),
        })
      ),
    }),
  })
  .transform((val) => {
    const entries = val.Document.BkToCstmrStmt.Stmt.Ntry ?? []
    return {
      entries: entries.map((val) => ({
        accountServicerReference: val.AcctSvcrRef,
        amount: {
          value: val.Amt._,
          currency: val.Amt.$.Ccy,
        },
        creditDebitIndicator: val.CdtDbtInd,
        reversalIndicator: val.RvslInd,
        valueDate: val.ValDt.Dt,
        bookingDate: val.BookgDt.Dt,
        additionalEntryInfo: val.AddtlNtryInf,
        cardTransaction: {
          poi: val.CardTx?.POI.Id.Id,
        },
        details: {
          relatedParties: {
            creditor: {
              name: val.NtryDtls?.TxDtls.RltdPties.Cdtr?.Nm,
              addressLine:
                val.NtryDtls?.TxDtls.RltdPties.Cdtr?.PstlAdr?.AdrLine,
            },
            debtor: {
              name: val.NtryDtls?.TxDtls.RltdPties.Dbtr?.Nm,
              addressLine:
                val.NtryDtls?.TxDtls.RltdPties.Dbtr?.PstlAdr?.AdrLine,
            },
          },
        },
      })),
    }
  })
export type Camt053SchemaType = z.infer<typeof Camt053Schema>
