// import { Room } from "twilio-video";
import { createReducer } from "typesafe-actions";
import {
  addAudioEnabledAction,
  addVideoEnabledAction,
  clearActualUsersAction,
  clearEnabledListAction,
  removeAudioEnabledAction,
  removeVideoEnabledAction,
  setActualUsersAction,
  setIsTwilioChatroomOn,
  setSelectedAudioDeviceAction,
  setSelectedVideoDeviceAction,
} from "./actions";
// import {
//   asyncState,
//   createAsyncReducer,
//   transformToArray,
// } from "../../lib/reducerUtils";
// import { disconnectARoom, } from "../../lib/twilio";
// import { connectToARoomAsyncAction, disconnectARoomAction } from "./actions";
import { TwilioState, TwilioAction } from "./types";

const initialState: TwilioState = {
  // room: asyncState.initial(null),
  video_enabled: [],
  audio_enabled: [],
  actualUsers: [],
  selectedVideoDevice: "",
  selectedAudioDevice: "",
  isTwilioChatroomstart: false,
};
const twilio = createReducer<TwilioState, TwilioAction>(initialState)
  // .handleAction(
  //   transformToArray(connectToARoomAsyncAction),
  //   createAsyncReducer(connectToARoomAsyncAction, "room")
  // )
  .handleAction(addVideoEnabledAction, (state, action) => {
    return {
      ...state,
      video_enabled: state.video_enabled.concat(action.payload),
    };
  })
  .handleAction(removeVideoEnabledAction, (state, action) => {
    return {
      ...state,
      video_enabled: state.video_enabled.filter(
        (uid) => uid !== action.payload
      ),
    };
  })
  .handleAction(addAudioEnabledAction, (state, action) => {
    return {
      ...state,
      audio_enabled: state.audio_enabled.concat(action.payload),
    };
  })
  .handleAction(removeAudioEnabledAction, (state, action) => {
    return {
      ...state,
      audio_enabled: state.audio_enabled.filter(
        (uid) => uid !== action.payload
      ),
    };
  })
  .handleAction(clearEnabledListAction, (state) => {
    return {
      ...state,
      video_enabled: [],
      audio_enabled: [],
    };
  })
  .handleAction(setActualUsersAction, (state, action) => {
    return {
      ...state,
      actualUsers: action.payload,
    };
  })
  .handleAction(clearActualUsersAction, (state) => {
    return {
      ...state,
      actualUsers: [],
    };
  })
  .handleAction(setSelectedVideoDeviceAction, (state, action) => {
    return {
      ...state,
      selectedVideoDevice: action.payload,
    };
  })
  .handleAction(setSelectedAudioDeviceAction, (state, action) => {
    return {
      ...state,
      selectedAudioDevice: action.payload,
    };
  })
  .handleAction(setIsTwilioChatroomOn, (state, action) => {
    return {
      ...state,
      isTwilioChatroomstart: action.payload,
    };
  });
export default twilio;
