import { S3 } from '@aws-sdk/client-s3'

export const s3 = new S3({ region: process.env.AWS_REGION ?? 'us-east-1' })
