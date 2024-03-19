import { Dispatch } from "react";
import { getChatlinkAsyncAction, getChatlinkFunctionsAsyncAction } from "../../modules/firebase";
import logger from "../custom-logger/logger";

export function onInsertChatlinkInput (chatlink: string) {
  // if (isChatlinkValid(chatlink)) {
  //   const actualChatlink = chatlink.split("/").pop() as string;
  //   // logger("[onInsertChatlinkInput] actualChatlink::", actualChatlink);
  //   // dispatch(getChatlinkAsyncAction.request(actualChatlink));
  //   // chatlinkRequest(actualChatlink,dispatch)
  //   return actualChatlink
  //   // setChatlink(actualChatlink);
  // } else {
  //   logger("not a valid chatlink");
  //   return ""
  // }
  
  return "chatlink_from_onInsertChatlinkInput"
};

export function redirectedChatlink (chatlink: string , dispatch:Dispatch<any>) {
  logger("[redirectedChatlink] chatlink::", chatlink);
  dispatch(getChatlinkFunctionsAsyncAction.request(chatlink));
  // chatlinkRequest(chatlink,dispatch) -> /ch/dasdsad 로 오니까 처리 추가해줘야함
};

export function chatlinkRequest(chatlink:string , dispatch:Dispatch<any>){
  logger("[chatlinkRequest] chatlink::", chatlink);
  dispatch(getChatlinkAsyncAction.request(chatlink));
}