import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const isOffline = process.env.IS_OFFLINE === 'true'
const accessKeyId = process.env.AWS_ACCESS_KEY ?? 'local'
const secretAccessKey = process.env.AWS_SECRET ?? 'local'

const dynamoDbClientParams = {
  region: process.env.AWS_REGION ?? 'us-east-1',
  ...(isOffline && {
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })
}

const client = new DynamoDBClient(dynamoDbClientParams)
export const dbclient = DynamoDBDocumentClient.from(client)
