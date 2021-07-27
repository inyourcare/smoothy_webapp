import { GetAccessTokenPayload } from "./types";
import twilio from "twilio";
import twilioConfig from "../../config/twilio";

export function getAccessToken({ roomName, identity }: GetAccessTokenPayload) {
  // const AccessToken = require('twilio').jwt.AccessToken;
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioConfig.accountProdSid as string,
    twilioConfig.videoApiSid as string,
    twilioConfig.videoApiSecret as string
  );
  token.identity = identity;

  // Create a Video grant which enables a client to use Video
  // and limits access to the specified Room (DailyStandup)
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // Add the grant to the token
  token.addGrant(videoGrant);

  return token.toJwt();
}