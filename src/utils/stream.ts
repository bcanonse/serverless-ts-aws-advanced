import { type Readable } from 'node:stream'

export const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
  })
}
