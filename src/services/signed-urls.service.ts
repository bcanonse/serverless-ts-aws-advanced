import AWS from 'aws-sdk'
import { type Context, type APIGatewayEvent } from 'aws-lambda'

import responseObject from '../utils/response'

import { type ResponseCustom } from '../types'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const signedUrl = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<ResponseCustom> => {
  try {
    const filename = event.queryStringParameters?.filename

    if (filename == null) {
      return responseObject(200, { message: 'filename is required' })
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', {
      Key: `upload/${filename}`,
      Bucket: process.env.BUCKET,
      Expires: 300
    })

    return responseObject(200, { body: { signedUrl } })
  } catch (error) {
    return responseObject(500, { message: 'Error of signed url not handler' })
  }
}
