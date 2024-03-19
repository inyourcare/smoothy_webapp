import firebase from "firebase";
import { firebaseDatabase, firebaseFirestore } from ".";
import { SmoothyUser } from "../../modules/firebase";
import constants from "../common/constants";
import logger from "../custom-logger/logger";
import { getCurrentUser, sessionId } from "./auth";
import {
  FirestoreProfile,
  GetChatLinkResult,
  GetChatLinkResultWithProfile,
  YoutubePlayback,
  isGetChatlinkResult,
} from "./types";

// notificationId 관리
var storedNotiId: string | null;

export async function firestoreTest() {
  return await firebaseFirestore()
    .collection("profiles")
    .doc("fKiUZg8qi0etQr99eTRj")
    .get()
    .then(function (result) {
      logger("firestoretest", result);
    })
    .catch(function (error) {
      throw new Error(error);
    });
}
export async function getChatLink(
  openChatLink: string
): Promise<GetChatLinkResultWithProfile> {
  logger("[getChatLink]", openChatLink);
  return await firebaseFirestore()
    .collection("openchat")
    .doc(openChatLink)
    .get()
    .then(function (result) {
      logger("[getChatLink] results from opnchat", result.data());
      const openchatResult = result.data() as GetChatLinkResult;
      if (isGetChatlinkResult(openchatResult)) {
        return getProgfile(openchatResult.sender).then(function (profile) {
          const result = {
            nickname: profile?.nickname,
            photoUriString: profile?.photoUriString,
            openChatLink,
            ...openchatResult,
          } as GetChatLinkResultWithProfile;
          return result;
        });
      }
      throw new Error("Chatlink data is not valid");
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function addMeToParty(partyId: string) {
  logger("addMeToParty", partyId);

  return firebaseFirestore()
    .collection("party_members")
    .doc(partyId)
    .collection("members")
    .doc(getCurrentUser()?.uid)
    .set({
      key: getCurrentUser()?.uid,
      status: 2,
      video: 1,
      audio: true,
      speaker: true,
    })
    .then(function (result) {
      logger("addMeToParty well");
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function removeMeFromParty(partyId: string) {
  logger("removeMeFromParty");
  return firebaseFirestore()
    .collection("party_members")
    .doc(partyId)
    .collection("members")
    .doc(getCurrentUser()?.uid)
    .delete()
    .then(function (result) {
      logger("removeMeFromParty well");
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export function newPartyNo() {
  logger("newPartyNo");
  const ref = firebaseFirestore().collection("party").doc();
  return `party_${ref.id}`;
}

export async function updateProfileParty(partyNo: string | null) {
  // null for delete
  logger(`[updateProfileParty]`);
  return firebaseFirestore()
    .collection("profiles")
    .doc(getCurrentUser()?.uid)
    .update({
      party: partyNo ? partyNo : firebase.firestore.FieldValue.delete(),
    })
    .then(function (result) {
      logger("[updateProfileParty] result", result);
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}
export async function updateProfileNickname(nickname: string) {
  // null for delete
  logger(`[updateProfileNickname]`);
  return firebaseFirestore()
    .collection("profiles")
    .doc(getCurrentUser()?.uid)
    .update({
      nickname: nickname,
    })
    .then(function (result) {
      logger("[updateProfileUsername] result", result);
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function updateProfilePartyGroup(partyGroup: string | null) {
  // null for delete
  logger(`[updateProfilePartyGroup]`);
  return firebaseFirestore()
    .collection("profiles")
    .doc(getCurrentUser()?.uid)
    .update({
      partyGroup: partyGroup
        ? partyGroup
        : firebase.firestore.FieldValue.delete(),
    })
    .then(function (result) {
      logger("[updateProfilePartyGroup] result", result);
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function removeGroupId() {
  logger(`removeGroupId`);
  return firebaseFirestore()
    .collection("profiles")
    .doc(getCurrentUser()?.uid)
    .update({ groupId: firebase.firestore.FieldValue.delete() })
    .then(function (result) {
      logger("removeGroupId well");
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}
export async function getPartyMembers(
  partyId: string
): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
  logger(`getPartyInfo ${partyId}`);
  return await firebaseFirestore()
    .collection("party_members")
    .doc(partyId)
    .collection("members")
    .get()
    .then(function (result) {
      logger("getPartyMembers well");
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function getMyFriendList() {
  logger("getMyFriendList");
  return firebaseFirestore()
    .collection("friend_list")
    .doc(getCurrentUser()?.uid)
    .collection("members")
    .get()
    .then(function (result) {
      logger("getMyFriendList well");
      return result;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export function checkAndUpdateUserOnline(uid: string) {
  logger("[checkUserOnline]", uid);
  var sfDocRef = firebaseFirestore().collection("profiles").doc(uid);
  return firebaseFirestore().runTransaction(async (transaction) => {
    const profileDoc = await transaction.get(sfDocRef);
    if (profileDoc.exists) {
      const dbSessionId = profileDoc.data()?.sessionId;
      if (dbSessionId && dbSessionId !== sessionId) {
        console.warn("[checkOnlineUser] user already has sessionId");
        // eslint-disable-next-line no-restricted-globals
        var userChecked = confirm(
          "이미 로그인 중인 아이디가 있는 것 같습니다. 계속 진행하시겠습니까?"
        );
        if (userChecked !== true) {
          // setTimeout(() => signOut(), 3000); // 로그아웃을 너무 빨리하면 credential 이 유효하여 한번 더 실행되는 버그가 있어 2초 후 실행되도록 변경
          throw Error("[checkOnlineUser] user already online");
        }
      }
      logger("[checkUserOnline] user not online");
      transaction.update(sfDocRef, {
        // online: true,
        // appVersion: constants.smoothy.appVersion,
        // webOs: constants.smoothy.os,

        webAppVersion: constants.smoothy.appVersion,
        os: constants.smoothy.os,
        webOnline: true,
        sessionId,
        pause: false,
      });
    }
  });
}

export function updateUserBackToOffline(uid: string) {
  logger("[updateUserBackToOffline]", uid);
  var sfDocRef = firebaseFirestore().collection("profiles").doc(uid);
  return firebaseFirestore().runTransaction(async (transaction) => {
    const profileDoc = await transaction.get(sfDocRef);
    if (profileDoc.exists) {
      const dbSessionId = profileDoc.data()?.sessionId;
      var update = {
        // online: firebase.firestore.FieldValue.delete(),
        // appVersion: firebase.firestore.FieldValue.delete(),
        // webOs: constants.smoothy.os,

        webAppVersion: firebase.firestore.FieldValue.delete(),
        os: firebase.firestore.FieldValue.delete(),
        webOnline: firebase.firestore.FieldValue.delete(),
        pause: true,
      };
      if (dbSessionId === sessionId) {
        Object.assign(update, {
          sessionId: firebase.firestore.FieldValue.delete(),
        });
      }
      logger(
        "[updateUserBackToOffline] profile exists",
        profileDoc.data(),
        update,
        dbSessionId,
        sessionId
      );
      transaction.update(sfDocRef, update);
    }
  });
}

// export function updateProfileWhenActivated(user: SmoothyUser) {
//   var sfDocRef = firebaseFirestore().collection("profiles").doc(user.key);
//   return firebaseFirestore()
//     .runTransaction(async (transaction) => {
//       const profileDoc = await transaction.get(sfDocRef);
//       if (profileDoc.exists) {
//         const webOnline = profileDoc.data()?.webOnline
//         if (webOnline){
//           throw Error("[updateProfileWhenActivated] user already online");
//         }
//       }

//       transaction.update(sfDocRef, {
//         online: true,
//         os: constants.smoothy.os,
//         appVersion: constants.smoothy.appVersion,
//         webOnline: true,
//         webOs: constants.smoothy.os,
//         webAppVersion: constants.smoothy.appVersion,
//       });
//     })
//     .then(() => {
//       console.log("[updateProfileWhenActivated] Transaction successfully committed!");
//     })
//     .catch((error) => {
//       console.log("[updateProfileWhenActivated] Transaction failed: ", error);
//     });

//   // logger(`updateProfileWhenActivated`, user);
//   // firebaseFirestore()
//   //   .collection("profiles")
//   //   .doc(user.key)
//   //   .update({
//   //     online: true,
//   //     os: constants.smoothy.os,
//   //     appVersion: constants.smoothy.appVersion,
//   //     webOnline: true,
//   //     webOs: constants.smoothy.os,
//   //     webAppVersion: constants.smoothy.appVersion,
//   //   })
//   //   .then(function (result) {
//   //     logger("updateProfileWhenActivated well");
//   //     return result;
//   //   })
//   //   .catch(function (error) {
//   //     throw new Error(error);
//   //   });
// }
export function updateProfileWhenDeactivated(uid: string | null) {
  logger(`[updateProfileWhenDeactivated]`, uid);
  var update = {
    // online: firebase.firestore.FieldValue.delete(),
    // appVersion: firebase.firestore.FieldValue.delete(),
    // webOs: firebase.firestore.FieldValue.delete(),
    // notificationId: firebase.firestore.FieldValue.delete()

    os: firebase.firestore.FieldValue.delete(),
    webOnline: firebase.firestore.FieldValue.delete(),
    webAppVersion: firebase.firestore.FieldValue.delete(),
    pause: true,
  };
  if (uid) {
    getProgfile(uid)
      .then(function (profile) {
        if (profile.sessionId === sessionId)
          Object.assign(update, {
            sessionId: firebase.firestore.FieldValue.delete(),
          });
      })
      .then(function () {
        firebaseFirestore()
          .collection("profiles")
          .doc(uid)
          .update(update)
          .then(function (result) {
            logger("[updateProfileWhenDeactivated] result -> ", result);
          })
          .then(function (result) {
            logger("[updateProfileWhenDeactivated] well");
            return result;
          })
          .catch(function (error) {
            throw new Error(error);
          });
        if (storedNotiId) addDeviceIdToTriggerForDelete({ userId: uid });
      });
  }
}

export async function updateProfileWhenRegistered(
  user: SmoothyUser,
  username: string,
  photoUriString: string | null
) {
  logger(`[updateProfileWhenRegistered]`, user);
  var update = {
    username,
  };
  if (photoUriString) Object.assign(update, { photoUriString });
  return firebaseFirestore()
    .collection("username")
    .doc(username)
    .set({ userId: user.key })
    .then(function (result) {
      logger("[updateProfileWhenRegistered] create username well");
      firebaseFirestore()
        .collection("profiles")
        .doc(user.key)
        // .update({ username })
        // .update(update)
        .set(update,{ merge: true })
        .then(function (result) {
          logger("[updateProfileWhenRegistered] well");
          return result;
        })
        .catch(function (error) {
          throw new Error(error);
        });
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function getSenderCurrentParty(
  sender: string
): Promise<string | null> {
  logger(`getSenderCurrentParty ${sender}`);
  return await firebaseFirestore()
    .collection("profiles")
    .doc(sender)
    .get()
    .then(function (result) {
      logger("sender's profile", result.data());
      if (
        result &&
        result.data() &&
        (result.data() as firebase.firestore.DocumentData).party
      )
        return (result.data() as firebase.firestore.DocumentData).party;
      else return null;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function updateFirestoreWhenNotificationPermitted(
  user: SmoothyUser,
  notificationId: string
) {
  logger(`[updateProfileWhenNotificationPermitted]`, user, notificationId);
  // firebaseFirestore()
  //   .collection("profiles")
  //   .doc(user.key)
  //   .update({
  //     online: true,
  //     os: constants.smoothy.os,
  //     appVersion: constants.smoothy.appVersion,
  //     notificationId,
  //   })
  //   .then(function (result) {
  //     logger("[updateProfileWhenNotificationPermitted] well");
  //     return result;
  //   })
  //   .catch(function (error) {
  //     throw new Error(error);
  //   });
  return firebaseFirestore()
    .collection("webapp")
    .doc(user.key)
    .delete()
    .then(function () {
      return addDeviceIdToTriggerForCreate({
        userId: user.key,
        os: constants.smoothy.os,
        appVersion: constants.smoothy.appVersion,
        notificationId,
      });
    });
}
type AddDeviceIdToTriggerDeleteParam = {
  userId?: string;
};
async function addDeviceIdToTriggerForDelete({
  userId,
}: AddDeviceIdToTriggerDeleteParam) {
  logger(`[addDeviceIdToTriggerForDelete]`);
  return firebaseFirestore()
    .collection("webapp")
    .doc(userId)
    .collection("delete")
    .doc()
    .set({ notificationId: storedNotiId, sendTimeStamp: Date.now() })
    .then(function (result) {
      logger("[addDeviceIdToTriggerForDelete] add deviceId well");
      storedNotiId = null;
    })
    .catch(function (error) {
      console.error("[addDeviceIdToTriggerForDelete] err");
      throw new Error(error);
    });
}
type AddDeviceIdToTriggerCreateParam = {
  notificationId: string;
  userId?: string;
  appVersion?: string;
  os?: string;
  language?: string;
};
async function addDeviceIdToTriggerForCreate({
  notificationId,
  userId = getCurrentUser()?.uid as string,
  appVersion = constants.smoothy.appVersion,
  os = constants.smoothy.os,
}: AddDeviceIdToTriggerCreateParam) {
  logger(`[addDeviceIdToTriggerForCreate]`);
  return firebaseFirestore()
    .collection("webapp")
    .doc(userId)
    .collection("create")
    .doc()
    .set({
      notificationId,
      appVersion,
      os,
      sendTimeStamp: Date.now(),
      language: "ko",
    })
    .then(function (result) {
      logger("[addDeviceIdToTriggerForCreate] add deviceId well");
      storedNotiId = notificationId;
    })
    .catch(function (error) {
      console.error("[addDeviceIdToTriggerForCreate] err");
      throw new Error(error);
    });
}

export async function getProgfile(uid: string) {
  logger(`[getProgfile] ${uid}`);
  return await firebaseFirestore()
    .collection("profiles")
    .doc(uid)
    .get()
    .then(function (result) {
      logger("[getProgfile] profile::", result.data());
      return result.data() as FirestoreProfile;
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export async function getPartyId() {
  logger(`[getPartyId] start`);
  return `party_${firebaseFirestore().collection("party").doc().id}`;
}

////////////////////////////////
//
// realtime database
//
////////////////////////////////

export function addFullscreenReaction(
  partyId: string,
  type: string = "fullscreen",
  item: string,
  sender: string
) {
  logger("addFullscreenReaction", partyId, type, item, sender);
  const partyEffectRoomRef = firebaseDatabase().ref(
    "party_effect_room/" + partyId + "/" + type
  );
  partyEffectRoomRef
    .set({
      item,
      sender,
      count: 0,
      // sendTimeStamp: firebase.database.ServerValue.TIMESTAMP
      sendTimeStamp: Date.now(),
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export function addHammerReaction(
  partyId: string,
  targetUid: string,
  item: string,
  sender: string
) {
  logger("addHammerReaction", partyId, targetUid, item, sender);
  const partyEffectRoomRef = firebaseDatabase().ref(
    "party_effect/" + partyId + "/" + targetUid + "/view_transform"
  );
  partyEffectRoomRef
    .set({
      item,
      sender,
      count: firebase.database.ServerValue.increment(1),
      // sendTimeStamp: firebase.database.ServerValue.TIMESTAMP
      sendTimeStamp: Date.now(),
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

export function removeHammerReaction(partyId: string, targetUid: string) {
  logger("removeHammerReaction", partyId, targetUid);
  const partyEffectRoomRef = firebaseDatabase().ref(
    "party_effect/" + partyId + "/" + targetUid + "/view_transform"
  );
  partyEffectRoomRef.remove().catch(function (error) {
    throw new Error(error);
  });
}

export async function getUsername(username: string) {
  logger("[getUsername]", username);
  type Returning = {
    success: boolean;
    exist: boolean;
  };
  var returning: Returning = {
    success: false,
    exist: false,
  };
  return firebaseFirestore()
    .collection("username")
    .doc(username)
    .get()
    .then(function (result) {
      logger(result.data());
      returning.success = true;
      returning.exist = result.exists;
      return returning;
    })
    .catch(function (error) {
      console.error("[getUsername] error::", error);
      return returning;
    });
}
export async function writeUsernameTransaction(username: string) {
  var sfDocRef = firebaseFirestore().collection("username").doc(username);
  return firebaseFirestore()
    .runTransaction(async (transaction) => {
      const usernameDoc = await transaction.get(sfDocRef);
      if (usernameDoc.exists) {
        throw Error("usernameDoc exists!");
      }

      transaction.set(sfDocRef, { username });
    })
    .then(() => {
      console.log("Transaction successfully committed!");
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
}

export async function setPlayback(partyId: string, playback: YoutubePlayback) {
  logger("setPlayback", partyId);
  const playbackRef = firebaseDatabase().ref(
    "party_video/" + partyId + "/playback"
  );
  playback.sender = getCurrentUser()?.uid;
  playback.sendTimestamp = await getServerTime();

  if (playback.videoItem) {
    playbackRef
      .set({
        videoListItemId: playback.videoItem,
        ...playback,
      })
      .then(function () {
        logger("setPlayback done");
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }
  // let videoItem = playback.videoItem || null
  // if (!videoItem)
  //   videoItem = playbackRef.push().key

  // if (!videoItem)
  // playbackRef.set({
  //   videoListItemId: videoItem,
  //   ...playback
  // }).then(function(){
  //   logger('setPlayback done')
  // }).catch(function(error){
  //   throw new Error(error)
  // })
}
export async function changePlayback(partyId: string, changes: any) {
  logger("changePlayback", partyId, changes);
  const playbackRef = firebaseDatabase().ref(
    "party_video/" + partyId + "/playback"
  );
  changes.sender = getCurrentUser()?.uid;
  changes.sendTimestamp = await getServerTime();

  let update;
  if (changes.videoItem) {
    update = {
      videoListItemId: changes.videoItem,
      ...changes,
    };
  } else {
    update = {
      ...changes,
    };
  }
  playbackRef.update(update).catch(function (error) {
    throw new Error(error);
  });
}

export async function removePlayback(partyId: string) {
  logger("setPlayback", partyId);
  const playbackRef = firebaseDatabase().ref(
    "party_video/" + partyId + "/playback"
  );
  // const snapshot = await playbackRef.once("value")
  // const playback = snapshot.val() as YoutubePlayback
  // logger("playback loaded , " , playback)
  // if (playback && playback.sender === getCurrentUser()?.uid){
  playbackRef
    .remove()
    .then(function (data) {
      logger("playback removed successfully");
    })
    .catch(function (error) {
      throw new Error(error);
    });
  // }
}

export async function getServerTime() {
  logger("getServerTimeOffset");
  var offsetRef = firebaseDatabase().ref(".info/serverTimeOffset");
  const snapshot = await offsetRef.once("value");
  return (new Date().getTime() + snapshot.val()) as number;
}

export function addVideoToPlayList(
  partyId: string,
  videoItem: YoutubePlayback
) {
  logger("addVideoToPlayList", partyId);
  const videoListRef = firebaseDatabase()
    .ref("party_video_list/" + partyId + "/waitlist")
    .push(); // 푸쉬하는 순간 새로운 Ref 생성
  // const videoListItemId = videoListRef.push().key
  videoItem.videoItem = videoListRef.key as string;
  // delete videoItem.control
  // delete videoItem.position
  videoListRef
    .set({
      ...videoItem,
    })
    .then(function () {
      logger("addVideoToPlayList done");
    })
    .catch(function (error) {
      throw new Error(error);
    });
}
export async function removeItemsFromPlayList(partyId: string) {
  logger("removeItemsFromPlayList", partyId);
  const waitlistRef = firebaseDatabase().ref(
    "party_video_list/" + partyId + "/waitlist"
  );
  const snapshot = await waitlistRef.once("value");
  const waitlist = snapshot.val();
  logger("waitlist loaded , ", waitlist);

  if (waitlist) {
    const currentUser = getCurrentUser();
    const waitlistKeys = Object.keys(waitlist);
    const youtubePlayList = waitlistKeys.map((wKey) => {
      return waitlist[wKey];
    });
    youtubePlayList
      .filter((playItem) => playItem.sender === currentUser?.uid)
      .forEach((removeItem) => {
        firebaseDatabase()
          .ref(
            "party_video_list/" + partyId + "/waitlist/" + removeItem.videoItem
          )
          .remove()
          .then(function () {
            logger(
              `[removeItemsFromPlayList] ${removeItem.videoItem} is removed`
            );
          })
          .catch(function (error) {
            throw new Error(error);
          });
      });
  }
}

export async function deleteFirestoreTest() {
  logger("[deleteFirestoreTest]");
  const uid = getCurrentUser()?.uid;
  return firebaseFirestore()
    .collection("webapp")
    .doc(uid)
    .delete()
    .then(function () {
      logger("[deleteFirestoreTest] done", uid);
    });
  // deleteCollection(`webapp/${getCurrentUser()?.uid}`, 10)
}

// async function deleteCollection(db:firebase.firestore.Firestore, collectionPath:string, batchSize) {
// async function deleteCollection(collectionPath:string, batchSize:number) {
//   const db = firebaseFirestore()
//   const collectionRef = db.collection(collectionPath);
//   const query = collectionRef.orderBy('__name__').limit(batchSize);

//   return new Promise((resolve, reject) => {
//     deleteQueryBatch(query, resolve).catch(reject);
//   });
// }

// // async function deleteQueryBatch(db:firebase.firestore.Firestore, query:firebase.firestore.Query<firebase.firestore.DocumentData>, resolve:(value: unknown) => void) {
// async function deleteQueryBatch(query:firebase.firestore.Query<firebase.firestore.DocumentData>, resolve:(value: unknown) => void) {
//   const db = firebaseFirestore()
//   const snapshot = await query.get();

//   const batchSize = snapshot.size;
//   if (batchSize === 0) {
//     // When there are no documents left, we are done
//     resolve(0);
//     return;
//   }

//   // Delete documents in a batch
//   const batch = db.batch();
//   snapshot.docs.forEach((doc) => {
//     batch.delete(doc.ref);
//   });
//   await batch.commit();

//   // Recurse on the next process tick, to avoid
//   // exploding the stack.
//   process.nextTick(() => {
//     deleteQueryBatch(query, resolve);
//   });
// }
