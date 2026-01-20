import {
  type Context,
  type APIGatewayTokenAuthorizerEvent,
  type APIGatewayAuthorizerResult
} from 'aws-lambda'

// Update the function signature to use AWS types
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context: Context
): Promise<APIGatewayAuthorizerResult> => {
  if (event.authorizationToken === `Bearer ${process.env.JWT}`) {
    return {
      principalId: 'anonymous',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      }
    }
  }
  throw new Error('Unauthorized')
}
