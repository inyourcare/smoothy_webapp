export type GetAccessTokenPayload = {
  roomName: string;
  identity: string;
};
export type ConnectToARoomPayload = {
  token: string;
  roomName: string;
};

export type ConnectConfig = {
  name: string,
  audio: boolean,
  video: object
}

export const AttachedClassNameProvider = {
  video: "video-attached",
  audio: "audio-attached",
};


/**
 * Permits a type T to be null.
 */
 export type Nullable<T> = T | null;