import { handler } from './handler'

module.exports.handler = async () => {
  handler()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Lambda completed successfully',
    }),
  }
}
