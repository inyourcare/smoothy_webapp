import { Dispatch } from "react";
import { Room } from "twilio-video";
import {
  CLEAR_CHATLINK_DATA,
  CLEAR_FULLSCREEN_EFFECT,
  CLEAR_PARTY_MEMBERS,
} from "../../modules/firebase";
import {
  CLEAR_PING_LIST,
  CLEAR_PLAYBACK,
  SET_ROOM_CONNECTED,
} from "../../modules/smoothy";
import { CLEAR_ACTUAL_USERS, CLEAR_ENABLED_LIST } from "../../modules/twilio";
import logger from "../custom-logger/logger";
import {
  addMeToParty,
  getCurrentUser,
  getPartyMembers,
  // getVideoAccessTokenFromFunctions,
  pingForceJoin,
  removeMeFromParty,
  subscribePartyEffect,
  subscribePartyMembers,
  subscribePartyroomEffect,
  subscribeYoutube,
  unsbscribePartyMember,
  unsubscribePartyEffect,
  unsubscribePartyroomEffect,
  unsubscribeYoutube,
  updateProfileParty,
  updateProfilePartyGroup,
} from "../firebase";
import { attachTrackToHTML, connectToARoom, getAccessToken } from "../twilio";
import { appendEachScreenReaction, youtubeDeactivatedCallback } from "./common";
import constants from "./constants";

export async function connectRoomWithPartyNoAndAccessToken(
  partyNo: string,
  accessToken: string
) {
  logger("connectRoomWithChatLink");
  // const accessToken = getAccessToken({
  //   roomName: partyNo,
  //   identity: getCurrentUser()?.uid,
  // } as GetAccessTokenPayload);

  // dispatch(
  //   connectToARoomAsyncAction.request({
  //     token: getVidioAccessTokenResult.token,
  //     roomName: partyNo,
  //   } as ConnectToARoomPayload)
  // );

  const room = await connectToARoom({
    roomName: partyNo,
    token: accessToken,
  });
  logger("room connected", room);
  return room;
}

// export function attachTracksToARoom(room:Room,trackSpaces: Array<Element>){
//   attachTrackToHTML(room,trackSpaces)
// }
export function attachTracksToARoom(room: Room) {
  attachTrackToHTML(room);
}

// 스무디 개인 뷰의 높이 설정
export function getHeightForVideoSpace(len: number,youtuveHeight:number) {
  // return String(Math.floor(100 / (len > 6 ? 4 : len > 4 ? 3 : 2))) + "vh";
  const ceilHeight = 100 - youtuveHeight
  return (
    String(Math.floor(ceilHeight / (len > 6 ? 4 : len > 4 ? 3 : len > 2 ? 2 : 1))) +
    "vh"
  );
}

export function divHitByHammerAction(
  e: HTMLDivElement,
  hammerIntervalsList: Array<number>,
  widthScale: number,
  heigthScale: number,
  minWidth: number,
  minHeight: number
) {
  var originalWidth = e.clientWidth;
  var originalHeight = e.clientHeight;
  const parent = e.parentElement as HTMLDivElement;

  let time = 0;
  let hammerOnscreen = false;
  function hammer() {
    time += 1; // 0.01 초
    if (!hammerOnscreen && time >= 10) {
      appendEachScreenReaction(
        constants.reaction.eachscreen.hammer.img,
        "hitsound",
        e
      );
      hammerOnscreen = true;
    }
    if (time >= 10) {
      if (time <= 15) {
        parent.style.opacity = "0";
      } else if (time <= 35) {
        parent.style.opacity = "1";
      }
      if (time <= 43) {
        const tobeWidth =
          e.clientWidth - ((1 - widthScale) * originalWidth) / 33;
        const tobeHeight =
          e.clientHeight - ((1 - heigthScale) * originalHeight) / 33;
        if (tobeWidth > minWidth) e.style.width = tobeWidth + "px";
        if (tobeHeight > minHeight) e.style.height = tobeHeight + "px";
      } else {
        // e.style.width = e.clientWidth + ((parent.clientWidth-e.clientWidth)/57) + "px";
        // e.style.height = e.clientHeight + ((parent.clientHeight-e.clientHeight)/57) + "px";
      }
    }

    if (time >= 100) {
      window.clearInterval(intervalIdx);
    }
  }
  const intervalIdx = window.setInterval(hammer, 10);
  hammerIntervalsList.push(intervalIdx);
}
export function getBackToOriginalSizeAfterHammerHit(e: HTMLDivElement) {
  // e.style.width = "100%";
  // e.style.height = "100%";
  // const parent = e.parentElement as HTMLDivElement;
  // parent.style.backgroundColor = "";

  e.style.animation = "backToOrigin 1s none";
  const parent = e.parentElement as HTMLDivElement;
  setTimeout(() => {
    e.style.width = "100%";
    e.style.height = "100%";
    e.style.animation = "";
    parent.style.backgroundColor = "";
  }, 1000);
}

function preprocessToConnect(partyNo: string, dispatch: Dispatch<any>) {
  // subscribe
  subscribePartyMembers(partyNo, dispatch);
  subscribePartyroomEffect(partyNo, dispatch);
  subscribePartyEffect(partyNo, dispatch);
  subscribeYoutube(partyNo, dispatch);
  // update
  updateProfileParty(partyNo);
  addMeToParty(partyNo);
}
export function preprocessToDisconnect(
  partyNo: string,
  dispatch: Dispatch<any>
) {
  // unsubscibe
  unsbscribePartyMember(dispatch);
  unsubscribePartyroomEffect();
  unsubscribePartyEffect(); // 망치
  unsubscribeYoutube(dispatch);
  // module reducer 정리
  dispatch({ type: CLEAR_ACTUAL_USERS });
  dispatch({ type: CLEAR_ENABLED_LIST }); // video , audio track enable list
  dispatch({ type: CLEAR_PARTY_MEMBERS });
  dispatch({ type: CLEAR_FULLSCREEN_EFFECT });
  // dispatch({ type: DEACTIVATE_YOUTUBE, payload: partyNo });
  dispatch({ type: CLEAR_PLAYBACK });
  dispatch({ type: CLEAR_PING_LIST, payload: partyNo });
  // db 정리
  removeMeFromParty(partyNo);
  youtubeDeactivatedCallback(partyNo);
  updateProfileParty(null);
  updateProfilePartyGroup(null);
}
// export function connectToPartyWithChatlink(
//   partyNo: string,
//   sender: string,
//   setDisconnectDisabled: (disconnectDisabled: boolean) => void,
//   dispatch: Dispatch<any>
// ) {
//   preprocessToConnect(partyNo, dispatch);
//   const token = getAccessToken({
//     identity: getCurrentUser()?.uid as string,
//     roomName: partyNo,
//   })
//   connectRoomWithPartyNoAndAccessToken(partyNo, token)
//   .then(async function (room) {
//     dispatch({ type: SET_ROOM_CONNECTED, payload: room });
//     // 방이 연결 됐으니까 diconnect 가능
//     setDisconnectDisabled(false);
//     // 센더가 방에 없을경우 리턴핑 => 커넥트 =>
//     return getPartyMembers(partyNo).then(function (members) {
//       let isSenderInMembers = false;
//       members.forEach((member) => {
//         if (sender === member.data().key) isSenderInMembers = true;
//       });

//       if (!isSenderInMembers && sender !== getCurrentUser()?.uid) {
//         pingForChatlink(
//           getCurrentUser()?.displayName as string,
//           sender,
//           1,
//           partyNo
//         );
//       }
//       dispatch({ type: CLEAR_CHATLINK_DATA });
//       attachTracksToARoom(room);
//     });
//   });
//   // getVideoAccessTokenFromFunctions(
//   //   getCurrentUser()?.uid as string,
//   //   partyNo,
//   //   chatlink
//   // ).then(function (result) {
//   //   logger("getVidioAccessTokenResult", result);
//   //   // setAccessToken(result.token)
//   //   connectRoomWithPartyNoAndAccessToken(partyNo, result.token).then(function (
//   //     room
//   //   ) {
//   //     dispatch({ type: SET_ROOM_CONNECTED, payload: room });
//   //     // 방이 연결 됐으니까 diconnect 가능
//   //     setDisconnectDisabled(false);
//   //     // 센더가 방에 없을경우 리턴핑 => 커넥트 =>
//   //     return getPartyMembers(partyNo).then(function (members) {
//   //       let isSenderInMembers = false;
//   //       members.forEach((member) => {
//   //         if (sender === member.data().key) isSenderInMembers = true;
//   //       });

//   //       if (!isSenderInMembers && sender !== getCurrentUser()?.uid) {
//   //         pingForChatlink(
//   //           getCurrentUser()?.displayName as string,
//   //           sender,
//   //           1,
//   //           partyNo
//   //         );
//   //       }
//   //       dispatch({ type: CLEAR_CHATLINK_DATA });
//   //       attachTracksToARoom(room);
//   //     });
//   //   });
//   // });
// }

export function connectToParty(
  partyNo: string,
  sender: string,
  // setDisconnectDisabled: (disconnectDisabled: boolean) => void,
  dispatch: Dispatch<any>
) {
  preprocessToConnect(partyNo, dispatch);
  const accessToken = getAccessToken({
    roomName: partyNo,
    identity: getCurrentUser()?.uid as string,
  });

  logger("getAccessTokenResult", accessToken);
  // setAccessToken(result.token)
  connectRoomWithPartyNoAndAccessToken(partyNo, accessToken).then(
    async function (room) {
      dispatch({ type: SET_ROOM_CONNECTED, payload: room });
      // 방이 연결 됐으니까 diconnect 가능
      // setDisconnectDisabled(false);
      // 센더가 방에 없을경우 리턴핑 => 커넥트 =>
      return getPartyMembers(partyNo).then(function (members) {
        let isSenderInMembers = false;
        members.forEach((member) => {
          if (sender === member.data().key) isSenderInMembers = true;
        });

        if (!isSenderInMembers && sender !== getCurrentUser()?.uid) {
          pingForceJoin(
            getCurrentUser()?.displayName as string,
            sender,
            1,
            partyNo
          );
        }
        dispatch({ type: CLEAR_CHATLINK_DATA });
        attachTracksToARoom(room);
      });
    }
  );
}
