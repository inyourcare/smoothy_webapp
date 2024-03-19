import { firebaseFunctions } from ".";
import { store } from "../..";
import { ATTACH_PING_LIST, SET_BUTTON_DISABLE, SET_BUTTON_ENABLE } from "../../modules/smoothy";
import { createGroupFunctionsApi, getChatlinkFunctionsApi } from "../api/posts";
import logger from "../custom-logger/logger";
import { getYTPlayerJson, parseYoutubeVideoId } from "../util/parsingUtil";
import { getCurrentUser } from "./auth";
import { getServerTime, removeGroupId } from "./firestore";
import {
  CreateGroupFunctionsResult,
  GetChatLinkResultWithProfile,
} from "./types";

export function pingForceJoin(
  name: string,
  uid: string,
  count: number,
  partyNo: string
) {
  const dispatch = store.dispatch;
  logger("[pingForceJoin]", name, uid, count, partyNo);
  // 챗링크를 통한 호출이기 때문에 그룹아이디를 빼준다.
  removeGroupId();
  var sendNotificationHttp_v2 = firebaseFunctions().httpsCallable(
    "sendNotificationHttp_v2"
  );
  dispatch({
    type: ATTACH_PING_LIST,
    payload: {
      partyNo,
      uid,
      sent: true,
      come: false,
    },
  });
  sendNotificationHttp_v2({
    title: "Smoothy dev",
    body: `${name}님이 지금 불러요!`,
    name: name,
    type: "ping",
    party_id: partyNo,
    count: count,
    // group:"group_",
    // groupNo:"group_",
    // groupName:"myGroup",
    receiver_uids: [uid],
    sender_uid: getCurrentUser()?.uid,
  })
    .then((result) => {
      // Read result of the Cloud Function.
      logger("[pingForceJoin] sendNotificationHttp_v2 result::", result.data);
    })
    .catch((error) => {
      logger("[pingForceJoin] sendNotificationHttp_v2 error::", error);
    });
}

export async function getVideoAccessTokenFromFunctions(
  identity: string,
  room: string,
  openchatKey: string
) {
  logger("[getVideoAccessTokenFromFunctions]");
  var getVideoAccessToken = firebaseFunctions().httpsCallable(
    "getVideoAccessToken"
  );
  return await getVideoAccessToken({
    identity,
    room,
    openchatKey,
  }).then(function (response) {
    return {
      identity: response.data.identity as string,
      token: response.data.token as string,
    };
  });
}

export async function beFriendEachotherWithOpenchatlink(
  uid: string,
  openchatKey: string
) {
  logger("[beFriendEachotherWithOpenchatlink]");
  var beFriendEachOther =
    firebaseFunctions().httpsCallable("beFriendEachOther");
  return await beFriendEachOther({
    uid,
    openchat_key: openchatKey,
  }).then(function (response) {
    logger("[beFriendEachotherWithOpenchatlink] response", response.data);
    return {
      successList: response.data.success_friend_list as Array<any>,
      failList: response.data.fail_friend_list as Array<any>,
    };
  });
}

// export async function createUserDevice(
//   notificationId?: string,
//   userId: string = getCurrentUser()?.uid as string,
//   appVersion: string = constants.smoothy.appVersion,
//   os: string = constants.smoothy.os
// ) {
//   logger("[createUserDevice]", userId, appVersion, os);
//   if (!notificationId) notificationId = getFcmToken();
//   if (!notificationId) {
//     console.error(
//       "[createUserDevice] fcmGetToken failed",
//       Notification.permission,
//       notificationId
//     );
//     return null;
//   }
//   logger("[createUserDevice] notificationId", notificationId);
//   var createUserDeviceFunctions =
//     firebaseFunctions().httpsCallable("createUserDevice");
//   return createUserDeviceFunctions({
//     user_id: userId,
//     app_version: appVersion,
//     os,
//     notification_id: notificationId,
//     language: "ko",
//   })
//     .then(function (response) {
//       logger("[createUserDevice] result", response.data);
//       if (!response || !response.data || !response.data.device_id)
//         throw new Error("no device id");
//       localStorage.setItem(
//         constants.smoothy.device.id,
//         response.data.device_id
//       );
//       return {
//         success: response.data.success,
//         device_id: response.data.device_id,
//       };
//     })
//     .catch((e) => {
//       console.error(e);
//       throw new Error(e);
//     });
// }

// export async function updateUserDevice(
//   userId: string = getCurrentUser()?.uid as string,
//   appVersion: string = constants.smoothy.appVersion,
//   os: string = constants.smoothy.os,
//   // notificationId: string,
//   deviceId: string
// ) {
//   logger("[updateUserDevice]", userId, appVersion, os, deviceId);
//   return activateMessaging().then(async function (notificationId) {
//     if (!notificationId) {
//       logger("[updateUserDevice] fcmGetToken failed", Notification.permission);
//       return null;
//     }
//     var updateUserDeviceFunctions =
//       firebaseFunctions().httpsCallable("updateUserDevice");
//     return await updateUserDeviceFunctions({
//       user_id: userId,
//       app_version: appVersion,
//       os,
//       notification_id: notificationId,
//       device_id: deviceId,
//     }).then(function (response) {
//       logger("[updateUserDevice] result", response.data);
//       return {
//         success: response.data.success,
//       };
//     });
//   });
// }

// export async function deleteUserDevice(
//   userId: string = getCurrentUser()?.uid as string,
//   deviceId: string = localStorage.getItem(constants.smoothy.device.id) as string
// ) {
//   logger("deleteUserDevice", userId, deviceId);
//   var deleteUserDeviceFunctions =
//     firebaseFunctions().httpsCallable("deleteUserDevice");
//     // firebaseFunctions().httpsCallable("deleteUserDeviceOnRequest");
//   return deleteUserDeviceFunctions({
//     user_id: userId,
//     device_id: deviceId,
//   }).then(function (response) {
//     logger("deleteUserDevice result", response.data);
//     localStorage.setItem(constants.smoothy.device.id , "")
//     return {
//       success: response.data.success,
//     };
//   });
// }

export async function getYoutubeVideoInfo(videoUrl: string) {
  logger("[getYoutubeVideoInfo]getYoutubePlayback", videoUrl);
  var getYoutubeVideoInfo = firebaseFunctions().httpsCallable(
    // get youtube info 로 바꾸기
    "getYoutubeVideoInfo"
  );
  try {
    const response = await getYoutubeVideoInfo({
      videoUrl,
    });
    // Read result of the Cloud Function.
    logger("[getYoutubeVideoInfo]response data result::", response.data);
    if (
      response &&
      response.data &&
      response.data.result &&
      response.data.result.success === true
    ) {
      const videoId = parseYoutubeVideoId(videoUrl)
      if (videoId)
        return processYoutubeVideoInfo(response.data.result.response, videoId);
    }
    logger("[getYoutubeVideoInfo]response result invalid::", response.data);
  } catch (error) {
    logger("[getYoutubeVideoInfo]createYoutubePlayback error::", error);
  }
}

async function processYoutubeVideoInfo(response: any, videoId: string) {
  const jsonFromResponse = getYTPlayerJson(response);
  logger("[processYoutubeVideoInfo] jsonFromResponse::", jsonFromResponse);

  const largestReducer = (accumulator: any, currentValue: any) =>
    Number(accumulator["width"]) < Number(currentValue["width"])
      ? currentValue
      : accumulator;

  if (jsonFromResponse) {
    const title = jsonFromResponse["videoDetails"]["title"];
    const height = (
      Array.from(jsonFromResponse["streamingData"]["formats"])[0] as any
    )["height"];
    const secondHeight = (
      Array.from(jsonFromResponse["streamingData"]["adaptiveFormats"])[0] as any
    )["height"];
    const width = (
      Array.from(jsonFromResponse["streamingData"]["formats"])[0] as any
    )["width"];
    const secondWidth = (
      Array.from(jsonFromResponse["streamingData"]["adaptiveFormats"])[0] as any
    )["width"];
    const lengthSeconds = jsonFromResponse["videoDetails"]["lengthSeconds"];
    const url = (
      Array.from(
        jsonFromResponse["videoDetails"]["thumbnail"]["thumbnails"]
      ).reduce(largestReducer) as any
    )["url"];
    const isLive = jsonFromResponse?.videoDetails?.isLive;
    // const kewords = Array.from(jsonFromResponse["videoDetails"]["keywords"])?.reduce(
    //   (accumulator, currentValue) => accumulator + "," + currentValue
    // )
    const kewords = jsonFromResponse?.videoDetails?.keywords?.reduce
      ? jsonFromResponse?.videoDetails?.keywords?.reduce(
          (accumulator: any, currentValue: any) =>
            accumulator + "," + currentValue
        )
      : "";
    const category =
      jsonFromResponse["microformat"]["playerMicroformatRenderer"]["category"];

    // if (jsonFromResponse['playabilityStatus']['errorScreen']['playerErrorMessageRenderer']['reason'])
    if (
      jsonFromResponse?.playabilityStatus?.errorScreen
        ?.playerErrorMessageRenderer?.reason
    )
      throw Error(
        "[processYoutubeVideoInfo] errorScreen" +
          jsonFromResponse["playabilityStatus"]["errorScreen"][
            "playerErrorMessageRenderer"
          ]["reason"]
      );

    if (isLive === true) throw Error("[processYoutubeVideoInfo] is live true");

    var playback = {
      // control: constants.youtube.control.play,
      height: height ? height : secondHeight ? secondHeight : -1,
      width: width ? width : secondWidth ? secondWidth : -1,
      lengthSeconds: Number(lengthSeconds),
      provider: "youtube",
      sendTimestamp: await getServerTime(),
      sender: getCurrentUser()?.uid as string,
      thumbnailUrl: url,
      title: title,
      videoId: videoId,
      // videoListItemId: "",
      keywords: kewords,
      category: category,
      isLive: isLive ? isLive : false,
    };
    console.log("[processYoutubeVideoInfo] playback=>", playback);
    return playback;
  } else throw new Error("[processYoutubeVideoInfo] html json parse none");

  // const arr: string[] = response.split("&");
  // const map = new Map();
  // arr.map((str) => {
  //   const letters = str.split("=");
  //   map.set(letters[0], decodeURIComponent(letters[1]));
  //   return null;
  // });

  // // console.log(map.keys())
  // // console.log(map.get('player_response'))
  // const jsonParsed = JSON.parse(map.get("player_response"));
  // if (jsonParsed && jsonParsed.videoDetails) {
  //   // console.log(jsonParsed.microformat.playerMicroformatRenderer.category)
  //   // console.log(jsonParsed.videoDetails)
  //   // console.log(jsonParsed.microformat)
  //   // console.log(jsonParsed.videoDetails.thumbnail.thumbnails)
  //   const thumbnails: any[] = Array.from(
  //     jsonParsed.videoDetails.thumbnail.thumbnails
  //   );
  //   var maxWidth = 0;
  //   var maxWidthThumbnail: any;
  //   // console.log(thumbnails)
  //   thumbnails.forEach((thumbnail) => {
  //     const width = Number(thumbnail.width);
  //     if (maxWidth < width) {
  //       maxWidth = width;
  //       maxWidthThumbnail = thumbnail;
  //     }
  //     // console.log(thumbnail)
  //   });

  //   const formats: any[] = Array.from(jsonParsed.streamingData.formats);
  //   const adaptiveFormats = jsonParsed.streamingData.adaptiveFormats;
  //   var streamingFormatWidth = -1;
  //   var streamingFormatHeight = -1;
  //   formats.concat(adaptiveFormats);
  //   formats.forEach((format) => {
  //     if (format.width && format.height) {
  //       streamingFormatWidth = format.width;
  //       streamingFormatHeight = format.height;
  //     }
  //   });

  //   const keywords = Array.from(jsonParsed.videoDetails.keywords);

  //   // console.log("successfully json parsed" , maxWidthThumbnail, formats)
  //   console.log("[processYoutubeVideoInfo] successfully json parsed");

  //   var playback = {
  //     // control: constants.youtube.control.play,
  //     height: streamingFormatHeight,
  //     lengthSeconds: Number(jsonParsed.videoDetails.lengthSeconds),
  //     provider: "youtube",
  //     sendTimestamp: await getServerTime(),
  //     sender: getCurrentUser()?.uid as string,
  //     thumbnailUrl: maxWidthThumbnail.url,
  //     title: jsonParsed.videoDetails.title,
  //     videoId: videoId,
  //     // videoListItemId: "",
  //     width: streamingFormatWidth,
  //     keywords: keywords.reduce(
  //       (accumulator, currentValue) => accumulator + "," + currentValue
  //     ),
  //     category: jsonParsed.microformat.playerMicroformatRenderer.category,
  //     isLive: false,
  //   };
  //   console.log("[processYoutubeVideoInfo] playback=>", playback);
  //   // db 권한 문제와 엮여 있어서 일단 값을 받아오는것만함
  //   //  return require('../core/db/party_video').addPartyVideo(partyId , playback).then(()=>{
  //   //     return {
  //   //         result:{
  //   //             success:true
  //   //         }
  //   //     }
  //   // })
  //   return playback;
  // } else {
  //   console.error("[processYoutubeVideoInfo] no-videoDetails");
  //   throw Error("no-videoDetails");
  // }
}

type ResighParams = {
  userId?: string;
  // deviceId?: string;
};
export async function resign({ userId }: ResighParams) {

  store.dispatch({type:SET_BUTTON_DISABLE})
  userId = getCurrentUser()?.uid as string;
  // deviceId = localStorage.getItem(constants.smoothy.device.id) as string;
  logger("[resign] params", userId);

  // if (!userId || !deviceId) {
  if (!userId) {
    console.warn(
      // "[resign] userId, deviceId must not be null",
      "[resign] userId must not be null",
      userId
      // deviceId
    );
    return;
  }
  // var deleteUserDeviceFunctions =
  //   firebaseFunctions().httpsCallable("deleteUserDevice");
  var removeUserFunctions = firebaseFunctions().httpsCallable("removeUserHttp");

  return removeUserFunctions({
    user_id: userId,
  })
    .then(function (response) {
      logger("[resign] removeUserFunctions result", response.data);
      if (response.data.success === true) {
        return {
          success: response.data.success,
        };
      }
    })
    .catch(function (err) {
      console.error("[resign] err", err);
    }).finally(()=>{
      store.dispatch({type:SET_BUTTON_ENABLE})
    })
  // return await deleteUserDeviceFunctions({
  //   user_id: userId,
  //   device_id: deviceId,
  // }).then(function (response) {
  //   logger("[resign] deleteUserDevice result", response.data);
  //   if (response.data.success === true){
  //     return removeUserFunctions({
  //       user_id: userId
  //     }).then(function (response) {
  //       logger("[resign] removeUserFunctions result", response.data);
  //       if (response.data.success === true){
  //       return {
  //           success: response.data.success,
  //         };
  //       }
  //     })
  //   }
  // })
  // .catch(function(err){
  //   console.error('[resign] err' , err)
  // })
}

// export async function testDoubleCall() {
//   logger("[testDoubleCall]");
//   // var deleteUserDeviceFunctions =
//   //   firebaseFunctions().httpsCallable("deleteUserDevice");
//   var removeUserFunctions = firebaseFunctions().httpsCallable("removeUserHttp");

//   return removeUserFunctions()
//     .then(function (response) {
//       logger("[testDoubleCall] removeUserFunctions result", response.data);
//       if (response.data.success === true) {
//         return {
//           success: response.data.success,
//         };
//       }
//     })
//     .catch(function (err) {
//       console.error("[testDoubleCall] err", err);
//     });
// }

export async function getChatlinkFunctions(
  openchatKey: string
): Promise<GetChatLinkResultWithProfile> {
  logger("[getChatlinkFunctions]", openchatKey);
  return getChatlinkFunctionsApi(openchatKey);
  // var getVideoAccessToken = firebaseFunctions().httpsCallable(
  //   "getOpenChat"
  // );
  // return await getVideoAccessToken({
  //   openchat_key:openchatKey,
  // }).then(function (response) {
  //   return response.data
  // });
}

export async function createGroupFunctions(
  groupName: string,
  partyID: string,
  members: string[],
  inviter: string
): Promise<CreateGroupFunctionsResult> {
  logger("[getChatlinkFunctions]", groupName, partyID, members, inviter);
  return createGroupFunctionsApi({ groupName, partyID, members, inviter });
  // var getVideoAccessToken = firebaseFunctions().httpsCallable(
  //   "getOpenChat"
  // );
  // return await getVideoAccessToken({
  //   openchat_key:openchatKey,
  // }).then(function (response) {
  //   return response.data
  // });
}

export async function createOpenChatFunctions(party_id: string) {
  logger("[createOpenChatFunctions]", party_id);
  return {
    success: true,
    openchatKey: "temporary_openchatkey",
  }
  // var createOpenChat = firebaseFunctions().httpsCallable("createOpenChat");

  // const uid = getCurrentUser()?.uid;
  // if (!uid) throw new Error("No signed in user");
  // return await createOpenChat({
  //   party_id,
  //   sender: uid,
  // })
  //   .then(function (response) {
  //     return {
  //       success: response.data.success as boolean,
  //       openchatKey: response.data.openchat_key as string,
  //     };
  //   })
  //   .catch(function (error) {
  //     throw new Error(error);
  //   });
}

export function testHttpsCallable(
  path: string,
  param: any // {partyId:"party_FIRQCUJsmuMy3RWGYiWR",videoId:"0ovJg6xN1N8"}
) {
  firebaseFunctions().useEmulator("localhost", 5001);
  var fuctionTest = firebaseFunctions().httpsCallable(path);
  return fuctionTest(param)
    .then(function (result) {
      // Read result of the Cloud Function.
      var sanitizedMessage = result.data.text;
      console.log(sanitizedMessage);
      return result
    })
    .catch(function (error) {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log({
        code: code,
        message: message,
        details: details,
      });
    });
}
