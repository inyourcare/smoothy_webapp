import firebase from "firebase/app";

export type SignInResult = {
  // additionalUserInfo?: firebase.auth.AdditionalUserInfo | null,
  // credential: firebase.auth.AuthCredential,
  // operationType?: string | null,
  // user: firebase.User
  username: string;
  key: string;
  nickname: string;
  webOnline?:boolean;
  webOs?:string;
  webAppVersion?:string
};

type TimestampFirebase = {
  seconds?: number,
  nanosenconds?:number,
  toMillis?:Function
}
export type GetChatLinkResult = {
  partyNo: string;
  sender: string;
  timestamp?: TimestampFirebase;
};
export type GetChatLinkResultWithProfile = GetChatLinkResult & {
  // partyNo:string;
  // sender: string;
  // timestamp: number;
  nickname?: string;
  photoUriString?: string;
  // openchat_key: string;
  // party_id: string;
  // sender: string;
  // timestamp: number;
  openChatLink?:string
};

export type CreateGroupFunctionsResult = {
  group:string
}

export type PartyMember = {
  key:string,//파티 참여자의 UID
  /*
    0: connecting - 대화방에 진입중
    2: ready - 대화방 진입 후 준비가 되었을 때
    4: pause - 설정, 친구 추가 화면, 또는 백그라운드 상태
    6: exit - 대화방에서 나가는 중
  */
  status:0|2|4|6,
  timestamp:string,//대화방에 참여한 시기
  typing:string,//현재 입력중인 텍스트
  content:string, //입력이 완료된 텍스트
  /*
    1: 비디오 온
    3: 비디오 오프
  */
  video:1|3,
  speaker: boolean // sound on / off,
  [key:string]: any
}

export type Friend = {
  key:string,//파티 참여자의 UID
  allowNotification:true|null,
  sendNotiAllowed:true|null,
  mute:true|null,
  blocked:true|null,
  friendship:true|null,
  status:0|40|41|60|80|100|580|600|1040|1041|1060|1080|1100,
  /*
    0: 나
    40: 친구
    41: 서로 친구 (대화방 링크 등으로 처음부터 41로 친구 추가한 경우)
    60: 나를 추가한 사용자
    80: 같은 파티에 있던 적이 있는 사용자
    100: 알 수도 있는 사용자
    580: hide 한번 이상 숨김 처리한 같은 파티에 있던 적이 있는 사용자
    600: hide 한번 이상 숨김 처리한 알 수도 있는 사용자
    1040: block 친구
    1041: block 서로 친구 (대화방 링크 등으로 처음부터 41로 친구 추가한 경우)
    1060: block 나를 추가한 사용자
    1080: block 같은 파티에 있던 적이 있는 사용자
    1100: block 알 수도 있는 사용자
  */
  action:4|5|6|8|10|11|12|13|40,
  /*
    4: 서로 친구가 됨
    5: 친구에게 핑을 보냄
    6: 친구에게 핑을 받음
    8: 내가 친구로 추가함
    10: 비디오
    11: 움짤
    12: 텍스트
    13: 대화움짤
    40: 핑 이력 아이템
  */
  actionText:string|null,
  actionSender:string|null,
  actionTimestamp:string|null,
  timestamp:string|null,
  updateTimestamp:string|null,
  ignoreCount:number,
  ignoreUntil:number,
  newMessage:number|null,
  lockOnCall:true|null
  [key:string]: any
}

export type FullscreenEffect = {
  count:number,
  item:string,
  sendTimeStamp:number,
  sender:string,
  target?:string
}

export type Username = {
  key:string
}

export type MessagingPayload = {
  arg_count:string,
  arg_notification_type: string,
  arg_party_no:string,
  arg_sender_key:string,
  arg_sender_name:string,
  arg_timestamp:string,
  voice: string
}

export type YoutubePlayback = {
  control?: string,
  height?: number,
  lengthSeconds?: number,
  position?: number,
  provider?: string,
  sendTimestamp?: number
  sender?: string
  thumbnailUrl?: string
  title?: string
  videoId?: string
  videoItem?: string
  width?: number,
  category?:string,
  keywords?: []
}

export type YoutubePlaylist = Array<YoutubePlayback>

export type FirestoreProfile = {
  nickname?:string,
  username:string,
  photoUriString?:string,
  backgroundColorIndex?:number,
  textColorIndex?:number,
  customFontIndex?:number
  welcome?:string,
  party?:string,
  partyGroup?:string,
  phoneNumber?:string,
  action?:string,
  online?:boolean,
  pause?:boolean,
  os?:string,
  appVersion?:string,
  notificationID?:string,
  showMessageGuidePopup?:boolean,
  sessionId?:string
}

export const AuthProviders = {
  Google: new firebase.auth.GoogleAuthProvider(),
  Facebook: new firebase.auth.FacebookAuthProvider(),
};

export function isSignInResult(result: SignInResult): result is SignInResult {
  return result.username !== undefined;
}

export function isGetChatlinkResult(result: GetChatLinkResult): result is GetChatLinkResult {
  return result.partyNo !== undefined && result.sender !== undefined;
}