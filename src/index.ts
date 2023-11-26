import { bankStatement } from './bankStatement'

module.exports.handler = async () => {
  try {
    await bankStatement()
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message:
          'Lambda encountered an error which prevented it from executing the request',
      }),
    }
  }

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
