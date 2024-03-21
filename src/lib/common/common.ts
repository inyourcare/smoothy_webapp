import { Dispatch } from "react";
import { store } from "../..";
import { SmoothyUser } from "../../modules/firebase";
import { CLEAR_PLAYBACK, CLEAR_PLAYLIST, CLEAR_SELECTED_VIDEO } from "../../modules/smoothy";
import logger from "../custom-logger/logger";
import {
  getCurrentUser,
  signOut,
  updateProfileWhenDeactivated
} from "../firebase";
import constants from "./constants";

export type ObjectType = {
  [key: string]: any;
};
export default function commonClose(
  dispatch: Dispatch<any>,
  event: Event,
  callback?: () => void,
  partyId?: string,
) {
  if (callback) callback();

  if (partyId){
    // youtubeDeactivatedCallback(partyId)
    youtubeDeactivatedCallback()
  }

  const currentUid = getCurrentUser()?.uid;
  if (currentUid) {
    updateProfileWhenDeactivated(currentUid);
    // const deviceId = localStorage.getItem(constants.smoothy.device.id);
    // if (deviceId) {
    // deleteUserDevice(currentUid,deviceId)
    // deleteUserDeviceIdAxios(currentUid,deviceId)
    // todo:: 삭제할 deviceId 를 달고 trigger 사켜서 삭제하게 하자
    // addDeviceIdToTriggerForDelete({userId:currentUid,deviceId})
    // }
  }

  if (localStorage.getItem(constants.smoothy.auth.rememberMe) !== "true") {
    logger("sign out");
    // const uid = getCurrentUser()?.uid;
    // dispatch({ type: SIGN_OUT, payload: uid });
    signOut();
  }

  // 서비스 워커 unregister
  navigator.serviceWorker
    .getRegistration(constants.smoothy.registration.push.scope)
    .then(function (registration) {
      // for (let registration of registrations) {
      if (registration) registration.unregister();
      // }
    })
    .catch(function (err) {
      console.error("Service Worker registration failed: ", err);
    });
    
  // null 을 return 할 경우 메시지 없고 문자를 return 할 경우 문구를 수정할 수 없는 경고가 뜸
  return null;
}

//
// effect
export function appendFullscreenReaction(reactionId: string, parant: Element) {
  logger("appendFullscreenReaction");
  const imgId = reactionId + Date.now().toString();
  const newImg = document.createElement("img");
  newImg.src = `${process.env.PUBLIC_URL}/smoothy-effect-resource/reaction/${reactionId}/${reactionId}.webp?${imgId}`;
  newImg.id = imgId;
  newImg.classList.add("fullscreen-effect");
  newImg.setAttribute(
    "style",
    "position: absolute; width: 100%; height: 100%; top: 50%; left: 50%; transform: translate(-50%, -50%);"
  );
  logger("src::", newImg.src);
  parant.appendChild(newImg);
  setTimeout(() => newImg.remove(), 3000);
}

export function appendEachScreenReaction(
  reactionId: string,
  audioId: string,
  target: Element
) {
  logger("appendSideReaction");
  const targetRect = target.getBoundingClientRect();
  logger(targetRect);
  const targetX = targetRect.x;
  const targetY = targetRect.y;

  const imgId = reactionId + Date.now().toString();
  const newImg = document.createElement("img");
  const newAud = document.createElement("audio");
  newImg.src = `${process.env.PUBLIC_URL}/smoothy-effect-resource/reaction/${reactionId}/${reactionId}.webp?${imgId}`;
  newAud.src = `${process.env.PUBLIC_URL}/smoothy-effect-resource/reaction/${reactionId}/${audioId}.mp3?${imgId}`;
  newImg.id = imgId;
  newImg.classList.add("eachscreen-effect");
  newAud.classList.add("eachscreen-effect");
  newAud.autoplay = true;
  newImg.setAttribute(
    "style",
    `position: fixed; transform: translate(-50%, -50%); top:${targetY}px; left:${targetX}px; pointer-events: none;`
  );
  logger("src::", newImg.src, newAud.src);
  // target.appendChild(newImg);
  // target.appendChild(newAud);
  setTimeout(() => {
    document.body.appendChild(newImg);
    document.body.appendChild(newAud);
  }, 100);

  setTimeout(() => newImg.remove(), 3000);
  setTimeout(() => newAud.remove(), 3000);
}

//
// common util
export function isSignedIn(user: SmoothyUser | null) {
  if (user) return true;
  else return false;
}

//
// notification permission
export function doFuncWhenGranted(fn: Function) {
  if (Notification.permission === "granted") {
    logger("granted notification permission", Notification.permission);
    return fn();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        logger(
          "denied notification permission changed to granted",
          Notification.permission
        );
        return fn();
      }
    });
  } else {
    logger("not grantd", Notification.permission);
    return null;
  }
}

export function defaultOnBeforeUnload() {
  const partyNo = store.getState().smoothy.twilioVideoChatProps?.partyNo
  return (event: Event) => {
    logger("[App] commonClose");
    commonClose(store.dispatch, event, undefined, partyNo?partyNo:undefined);
  };
}

// export function youtubeDeactivatedCallback(partyNo:string){
export function youtubeDeactivatedCallback(){
  // if (partyNo) {
    // removePlayback(partyNo);
    // removeItemsFromPlayList(partyNo);
    store.dispatch({ type: CLEAR_SELECTED_VIDEO });
    store.dispatch({ type: CLEAR_PLAYLIST });
    store.dispatch({ type: CLEAR_PLAYBACK });
  // }
}