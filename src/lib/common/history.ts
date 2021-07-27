import { store } from "../..";
import { SET_TWILIO_VIDEOCHAT_PROPS } from "../../modules/smoothy";
import { GetChatLinkResult } from "../firebase";
import * as H from 'history';

export type PushToTwilioVideoChatContainerParams = {
  chatlinkData:GetChatLinkResult,chatlink:string,history:H.History,from?:string
}
export function pushToTwilioVideoChatContainer({chatlinkData,chatlink,history,from}:PushToTwilioVideoChatContainerParams) {
  const dispatch = store.dispatch
  dispatch({
    type: SET_TWILIO_VIDEOCHAT_PROPS,
    payload: { ...chatlinkData, chatlink, from },
  });
  
  history.push({
    pathname: "/videochat",
    // search:"?test=abc",
    // state: { ...chatlinkData, chatlink },
  });
}

export function pushToHomeContainer(history:H.History) {
  history.push({
    pathname: "/"
  });
}

export type PushToHomeErrorPageContainer = {
  code:string,
  msg:string
}
export function pushToHomeErrorPageContainer(history:H.History , { code, msg }:PushToHomeErrorPageContainer) {
  history.push({
    pathname: "/error",
    state: { code , msg }
  });
}
