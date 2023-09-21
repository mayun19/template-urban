import { getFacebookAuth } from '@sirclo/nexus'
import { GRAPHQL_URI } from './Constants'
import { IncomingMessage } from 'http'

export const useFacebookAuth = async (req: IncomingMessage, token: string) => {
  return await getFacebookAuth(GRAPHQL_URI(req), token)
}