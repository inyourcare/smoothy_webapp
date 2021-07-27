import { FirestoreProfile } from "../../lib/firebase"

export type YoutubeProps = {
  partyId?:string
}

export type YoutubeVideoType = {
  id :string,
  title?: string,
  description?: string,
  thumbnail?:string,
  sender?:string,
  // profileImageUrl?:string
  senderProfile:FirestoreProfile |undefined
}