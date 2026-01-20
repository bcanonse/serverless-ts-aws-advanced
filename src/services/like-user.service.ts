/* eslint-disable no-console */
import { type SQSEvent, type Context } from 'aws-lambda'
import { dbclient } from '../utils/dynamo-db'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'

async function sleep(ms: number): Promise<unknown> {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

interface LikeUserMessage {
  id: string
}

export const likeUser = async (
  event: SQSEvent,
  _context: Context
): Promise<void> => {
  const body = event.Records[0].body

  if (body === null) {
    throw new Error('Body is required')
  }

  const message: LikeUserMessage = JSON.parse(body)
  const userid = message.id
  console.log(userid)

  const parms = new UpdateCommand({
    TableName: 'users',
    Key: { pk: userid },
    UpdateExpression: 'ADD likes :inc',
    ExpressionAttributeValues: {
      ':inc': 1
    },
    ReturnValues: 'ALL_NEW'
  })

  const result = await dbclient.send(parms)
  await sleep(4000)
  console.log(result)
}
