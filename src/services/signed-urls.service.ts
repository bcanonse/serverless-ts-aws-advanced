import { PutObjectCommand } from '@aws-sdk/client-s3'
import { type Context, type APIGatewayEvent } from 'aws-lambda'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '../lib/s3'

import responseObject from '../utils/response'

import { type ResponseCustom } from '../types'

export const signedUrl = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<ResponseCustom> => {
  try {
    const filename = event.queryStringParameters?.filename

    if (typeof filename !== 'string' || filename.trim() === '') {
      return responseObject(400, { message: 'filename is required' })
    }

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: `upload/${filename}`,
      ContentType: 'application/octet-stream'
    })

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300
    })

    return responseObject(200, { signedUrl })
  } catch (error) {
    return responseObject(500, { message: 'Error of signed url not handler' })
  }
}
