import { Room } from "twilio-video";
import { createAction, createAsyncAction } from "typesafe-actions";
import { ConnectToARoomPayload } from "../../lib/twilio/";

export const CONNECT_TO_A_ROOM = "twilio/CONNECT_TO_A_ROOM";
export const CONNECT_TO_A_ROOM_SUCCESS = "twilio/CONNECT_TO_A_ROOM_SUCCESS";
export const CONNECT_TO_A_ROOM_ERROR = "twilio/CONNECT_TO_A_ROOM_ERROR";

export const connectToARoomAsyncAction = createAsyncAction(
  CONNECT_TO_A_ROOM,
  CONNECT_TO_A_ROOM_SUCCESS,
  CONNECT_TO_A_ROOM_ERROR
)<ConnectToARoomPayload, Room, Error>();

export const DISCCONECT_A_ROOM = "twilio/DISCCONECT_A_ROOM";
export const disconnectARoomAction = createAction(DISCCONECT_A_ROOM)();
export const ATTACH_REMOTE_TRACKS = "twilio/ATTACH_REMOTE_TRACKS";
export const attachRemoteTracksAction = createAction(ATTACH_REMOTE_TRACKS)();

export const ADD_VIDEO_ENABLED = "twilio/ADD_VIDEO_ENABLED";
export const addVideoEnabledAction = createAction(ADD_VIDEO_ENABLED)<string>();
export const REMOVE_VIDEO_ENABLED = "twilio/REMOVE_VIDEO_ENABLED";
export const removeVideoEnabledAction = createAction(REMOVE_VIDEO_ENABLED)<string>();
export const ADD_AUDIO_ENABLED = "twilio/ADD_AUDIO_ENABLED";
export const addAudioEnabledAction = createAction(ADD_AUDIO_ENABLED)<string>();
export const REMOVE_AUDIO_ENABLED = "twilio/REMOVE_AUDIO_ENABLED";
export const removeAudioEnabledAction = createAction(REMOVE_AUDIO_ENABLED)<string>();
export const CLEAR_ENABLED_LIST = "twilio/CLEAR_ENABLED_LIST";
export const clearEnabledListAction = createAction(CLEAR_ENABLED_LIST)();
export const SET_ACTUAL_USERS = "twilio/SET_ACTUAL_USERS";
export const setActualUsersAction = createAction(SET_ACTUAL_USERS)<string[]>();
export const CLEAR_ACTUAL_USERS = "twilio/CLEAR_ACTUAL_USERS";
export const clearActualUsersAction = createAction(CLEAR_ACTUAL_USERS)();
export const SET_SELECTED_VIDEO_DEVICE = "twilio/SET_SELECTED_VIDEO_DEVICE";
export const setSelectedVideoDeviceAction = createAction(SET_SELECTED_VIDEO_DEVICE)<string>();
export const SET_SELECTED_AUDIO_DEVICE = "twilio/SET_SELECTED_AUDIO_DEVICE";
export const setSelectedAudioDeviceAction = createAction(SET_SELECTED_AUDIO_DEVICE)<string>();
export const SET_IS_TWILIO_CHATROOM_ON = "twilio/SET_IS_TWILIO_CHATROOM_ON";
export const setIsTwilioChatroomOn = createAction(SET_IS_TWILIO_CHATROOM_ON)<boolean>();