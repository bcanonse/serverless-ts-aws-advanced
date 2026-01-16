import {
  type APIGatewayProxyResult,
  type APIGatewayEvent,
  type Context
} from 'aws-lambda'

import { signedUrl } from '../../services/signed-urls.service'

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return await signedUrl(event, context)
}
