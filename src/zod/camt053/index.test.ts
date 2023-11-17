import { Camt053Schema } from '.'
import { testData } from '../../testData'
test("The `Camt053Schema` zod codec doesn't throw errors on different kind of bank statements", () => {
  expect(() => {
    testData.forEach((data) => {
      Camt053Schema.parse(data)
    })
  }).not.toThrow()
})
