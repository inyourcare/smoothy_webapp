import * as action from "./actions";
import { ActionType } from "typesafe-actions";
import { SmoothyUser } from "../firebase";
import {
  FirestoreProfile,
  MessagingPayload,
  YoutubePlayback,
  YoutubePlaylist,
} from "../../lib/firebase";
import { Room } from "twilio-video";
import { YoutubeVideoType } from "../../components/youtube/types";
import { AlertSnackbarSeverity } from "../../components/snackbar/AlertSnackbar";

export type youtubeDivWidthHeight = {
  width: number,
  height: number
}
export type ToBeUser = SmoothyUser & {
  loading: boolean;
  credential: firebase.default.auth.AuthCredential;
  photoURL: string | null | undefined;
};
export type TwilioVideoChatProps = {
  partyNo: string | null | undefined;
  sender: string | null | undefined;
  chatlink?: string | null | undefined;
};
export type AlertSnackbarProps = {
  severity: AlertSnackbarSeverity | null;
  alertMessage: string | null;
};
export type SmoothyAction = ActionType<typeof action>;
export type SmoothyState = {
  eachscreen: {
    hammer: boolean;
  };
  // youtubeMode: boolean,
  youtube: {
    sharedVideoPlayback: YoutubePlayback | null;
    playlist: YoutubePlaylist | null;
    selectedVideo: YoutubeVideoType | null;
  };
  toBeUser: ToBeUser | null;
  fcmMessage: Array<MessagingPayload>;
  twilioVideoChatProps: TwilioVideoChatProps | null;
  roomConnected: Room | null;
  pingListMap: PingListMap;
  buttonDisable: boolean;
  youtubeVideoDivWidthHeight: youtubeDivWidthHeight;
  videoChatUserProfiles: Map<string, FirestoreProfile>;
  myProfile: FirestoreProfile | null;
  alertSnackbar: AlertSnackbarProps | null;
};

export type PingListActionParams = {
  partyNo: string;
  uid: string;
  sent: boolean;
  come: boolean;
};
export type PingCheckState = {
  uid: string;
  sent: boolean;
  come: boolean;
};
export type PingListMap = Map<string, Array<PingCheckState>>;

export const AlertSeverityProvider = {
  error: "error",
  warning: "warning",
  info: "info",
  success: "success",
};
