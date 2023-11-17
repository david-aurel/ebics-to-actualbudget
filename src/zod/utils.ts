import { ZodTypeAny, z } from 'zod'

export const booleanFromString = z.preprocess(
  (value) => value === 'true',
  z.boolean()
)

export const fromArray = <T extends ZodTypeAny>(refinement: T) =>
  z.preprocess((value) => {
    if (!Array.isArray(value)) return value
    if (value.length > 1) return value
    if (value[0] === '') return undefined
    return value[0]
  }, refinement)
