import { camt053ToTransaction } from '.'
import { testData } from '../testData'
import { Camt053Schema } from '../zod/camt053'

test('The `camt053ToTransaction` function converts camt053 JSON into actual-budget transaction objects', () => {
  const results = testData.flatMap((data) =>
    camt053ToTransaction('test-account-id')(Camt053Schema.parse(data))
  )
  expect(results).toMatchSnapshot()
  expect(results.length).toBe(17)
})
