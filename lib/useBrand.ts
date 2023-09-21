import { ParsedUrlQuery } from 'querystring'
import { GRAPHQL_URI } from 'components/Constants'
import { IncomingMessage } from 'http'
import { getBrand } from '@sirclo/nexus'
import locales from 'locales'

export const useBrandCommon = async (
  req: IncomingMessage,
  params: ParsedUrlQuery,
  token: string
) => {
  try {
    const brand = await getBrand(GRAPHQL_URI(req), token)
    const lng = brand?.settings?.defaultLanguage || params.lng || 'id'
    const lngDict = locales(lng) || {}

    return {
      brand: brand || '',
      lngDict,
      lng
    }
  } catch (err) {
    console.log('Error while request brand: ', err)
  }
}