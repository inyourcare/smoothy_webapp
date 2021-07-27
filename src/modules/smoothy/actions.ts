import { Room } from "twilio-video";
import { createAction } from "typesafe-actions";
import { YoutubeVideoType } from "../../components/youtube/types";
import { FirestoreProfile, MessagingPayload, YoutubePlayback, YoutubePlaylist } from "../../lib/firebase";
import { AlertSnackbarProps, PingListActionParams, ToBeUser, TwilioVideoChatProps, youtubeDivWidthHeight } from "./types";

export const ACTIVATE_EACH_SCREEN_HAMMER_MODE = "smoothy/ACTIVATE_EACH_SCREEN_HAMMER_MODE";
export const DEACTIVATE_EACH_SCREEN_HAMMER_MODE = "smoothy/DEACTIVATE_EACH_SCREEN_HAMMER_MODE";
export const activateEachScreenHammerMode = createAction(ACTIVATE_EACH_SCREEN_HAMMER_MODE)();
export const deactivateEachScreenHammerMode = createAction(DEACTIVATE_EACH_SCREEN_HAMMER_MODE)();

// to be user
export const SET_TO_BE_USER = "smoothy/SET_TO_BE_USER";
export const setToBeUserAction = createAction(SET_TO_BE_USER)<ToBeUser>()
export const CLEAR_TO_BE_USER = "smoothy/CLEAR_TO_BE_USER";
export const clearToBeUserAction = createAction(CLEAR_TO_BE_USER)()
export const LOAD_DONE_TO_BE_USER = "smoothy/LOAD_DONE_TO_BE_USER";
export const loadDoneToBeUserAction = createAction(LOAD_DONE_TO_BE_USER)()

// notification
export const SET_FCM_MESSAGE = "smoothy/SET_FCM_MESSAGE";
export const setFCMMessageAction = createAction(SET_FCM_MESSAGE)<MessagingPayload>()
export const CLEAR_FCM_MESSAGE = "smoothy/CLEAR_FCM_MESSAGE";
export const clearFCMMessageAction = createAction(CLEAR_FCM_MESSAGE)()

// twilioVideoChatProps
export const SET_TWILIO_VIDEOCHAT_PROPS = "smoothy/SET_TWILIO_VIDEOCHAT_PROPS";
export const setTwilioVideochatPropsAction = createAction(SET_TWILIO_VIDEOCHAT_PROPS)<TwilioVideoChatProps>()
export const CLEAR_TWILIO_VIDEOCHAT_PROPS = "smoothy/CLEAR_TWILIO_VIDEOCHAT_PROPS";
export const clearTwilioVideochatPropsAction = createAction(CLEAR_TWILIO_VIDEOCHAT_PROPS)()

// roomConnected
export const SET_ROOM_CONNECTED = "smoothy/SET_ROOM_CONNECTED";
export const setRoomConnectedAction = createAction(SET_ROOM_CONNECTED)<Room>()
export const CLEAR_ROOM_CONNECTED = "smoothy/CLEAR_ROOM_CONNECTED";
export const clearRoomConnectedAction = createAction(CLEAR_ROOM_CONNECTED)()

// youtube
// export const ACTIVATE_YOUTUBE = "smoothy/ACTIVATE_YOUTUBE";
// export const DEACTIVATE_YOUTUBE = "smoothy/DEACTIVATE_YOUTUBE";
// export const activateYoutubeAction = createAction(ACTIVATE_YOUTUBE)();
// export const deactivateYoutubeAction = createAction(DEACTIVATE_YOUTUBE)<string>();
// playback
export const SET_PLAYBACK = "smoothy/SET_PLAYBACK";
export const setPlaybackAction = createAction(SET_PLAYBACK)<YoutubePlayback>()
export const CLEAR_PLAYBACK = "smoothy/CLEAR_PLAYBACK";
export const clearPlaybackAction = createAction(CLEAR_PLAYBACK)()
// play list
export const SET_PLAYLIST = "smoothy/SET_PLAYLIST";
export const setPlaylistAction = createAction(SET_PLAYLIST)<YoutubePlaylist>()
export const CLEAR_PLAYLIST = "smoothy/CLEAR_PLAYLIST";
export const clearPlaylistAction = createAction(CLEAR_PLAYLIST)()
// ping list
export const ATTACH_PING_LIST = "smoothy/ATTACH_PING_LIST"
export const attachPingListAction = createAction(ATTACH_PING_LIST)<PingListActionParams>()
export const CLEAR_PING_LIST = "smoothy/CLEAR_PING_LIST"
export const clearPingListAction = createAction(CLEAR_PING_LIST)<string>()
// selected video
export const SET_SELECTED_VIDEO = "smoothy/SET_SELECTED_VIDEO"
export const setSelectedVideoAction = createAction(SET_SELECTED_VIDEO)<YoutubeVideoType>()
export const CLEAR_SELECTED_VIDEO = "smoothy/CLEAR_SELECTED_VIDEO"
export const clearSelectedVideoAction = createAction(CLEAR_SELECTED_VIDEO)()
// button disabled
export const SET_BUTTON_DISABLE = "smoothy/SET_BUTTON_DISABLE"
export const setButtonDisableAction = createAction(SET_BUTTON_DISABLE)()
export const SET_BUTTON_ENABLE = "smoothy/SET_BUTTON_ENABLE"
export const setButtonEnableAction = createAction(SET_BUTTON_ENABLE)()
// youtubue div height
export const SET_YOUTUBE_DIV_WITH_HEIGHT = "smoothy/SET_YOUTUBE_DIV_WITH_HEIGHT"
export const setYoutubeDivWidthHeightAction = createAction(SET_YOUTUBE_DIV_WITH_HEIGHT)<youtubeDivWidthHeight>()
// user profiles
export const SET_VIDEOCHAT_USER_PROFILES = "smoothy/SET_VIDEOCHAT_USER_PROFILES"
export const setVideochatUserProfilesAction = createAction(SET_VIDEOCHAT_USER_PROFILES)<Map<string, FirestoreProfile>>()
// user profile image
export const SET_MY_PROFILE = "smoothy/SET_MY_PROFILE"
export const setMyProfileAction = createAction(SET_MY_PROFILE)<FirestoreProfile>()
// alert snackbar
export const SET_ALERT_SNACKBAR = "smoothy/SET_ALERT_SNACKBAR"
export const setAlertSnackbarAction = createAction(SET_ALERT_SNACKBAR)<AlertSnackbarProps>()