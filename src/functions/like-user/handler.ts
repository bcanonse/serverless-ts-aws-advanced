import { type Context } from 'aws-lambda'
import { likeUser } from '../../services/like-user.service'

export const handler = async (event, _context: Context): Promise<void> => {
  await likeUser(event, _context)
}
