/* eslint-disable no-console */
import { type Readable } from 'node:stream'
import util from 'node:util'

import { type S3Event, type Context } from 'aws-lambda'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

import { s3 } from '../../lib/s3'
import { streamToBuffer } from '../../utils/stream'

export const handler = async (
  event: S3Event,
  _context: Context
): Promise<void> => {
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 })
  )
  const srcBucket = event.Records[0].s3.bucket.name
  console.log(event.Records[0].s3.object)
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  )
  console.log(srcKey)

  const typeMatch = srcKey.match(/\.([^.]*)$/)
  if (typeMatch === null) {
    console.log('Could not determine the image type.')
    return
  }

  const imageType = typeMatch[1].toLowerCase()
  if (!['jpg', 'png'].includes(imageType)) {
    console.log(`Unsupported image type: ${imageType}`)
    return
  }

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: srcBucket,
      Key: srcKey
    })
  )

  if (response.Body === null) {
    console.log('Empty S3 object body')
    return
  }

  const imageBuffer = await streamToBuffer(response.Body as Readable)

  const widths = [50, 100, 200]

  for (const w of widths) {
    await resizer(imageBuffer, w, srcBucket, srcKey)
  }
}

const resizer = async (
  imgBody: Buffer,
  newSize: number,
  dstBucket: string,
  fileKey: string
): Promise<void> => {
  const nameFile = fileKey.split('/')[1]
  const dstKey = `resized/${newSize}-${nameFile}`
  let buffer = null
  try {
    buffer = await sharp(imgBody).resize(newSize).toBuffer()
  } catch (error) {
    console.log('Error to resizer', error)
    return
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: dstBucket,
        Key: dstKey,
        Body: buffer,
        ContentType: 'image/jpeg'
      })
    )
  } catch (error) {
    console.error('S3 putObject error', error)
    return
  }

  console.log(
    'Successfully resized ' +
      dstBucket +
      '/' +
      fileKey +
      ' and uploaded to ' +
      dstBucket +
      '/' +
      dstKey
  )
}
