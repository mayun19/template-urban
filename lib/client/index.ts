import { IncomingMessage } from 'http';
import {
  getGoogleAuth,
  getFacebookAuth,
  getBlogHeaderImage,
  getWhatsAppOTPSetting,
  getBanner
} from "@sirclo/nexus";

const GRAPHQL_URI = (req) => {
  return process.env.GRAPHQL_URI || `https://${req.headers.host}/graphql`;
}

export const useWhatsAppOTPSetting = async (
  req: IncomingMessage, 
  token: string
  ) => {
  return await getWhatsAppOTPSetting(GRAPHQL_URI(req), token)
}

export const handleGetBlogHeaderImage = async (
  req: IncomingMessage,
  token: string
  ) => {
  return await getBlogHeaderImage(GRAPHQL_URI(req), token);
}
export const handleGetBanner = async (
  req: IncomingMessage,
  token: string
  ) => {
  return await getBanner(GRAPHQL_URI(req), token)
}

export const useAuthMethod = async (
  req: IncomingMessage,
  token: string
  ) => {
  const hasGoogleAuth = await getGoogleAuth(GRAPHQL_URI(req), token);
  const hasFacebookAuth = await getFacebookAuth(GRAPHQL_URI(req), token);
  const hasOtp = await useWhatsAppOTPSetting(req, token)

  return {
    hasGoogleAuth,
    hasFacebookAuth,
    hasOtp,
  }
}