import { Dispatch } from "react";
import { firebaseAuth, firebaseDatabase, firebaseFirestore } from ".";
import { store } from "../..";
import { AlertSnackbarSeverity } from "../../components/snackbar/AlertSnackbar";
import {
  ADD_FULLSCREEN_EFFECT,
  ADD_PARTY_MEMBER,
  CLEAR_PARTY_MEMBERS,
  MODIFY_PARTY_MEMBER,
  REMOVE_PARTY_MEMBER,
  SET_FIREBASE_PROFILE,
  SIGN_OUT,
} from "../../modules/firebase";
import {
  AlertSeverityProvider,
  CLEAR_PLAYBACK,
  SET_ALERT_SNACKBAR,
  SET_MY_PROFILE,
  SET_PLAYBACK,
  SET_PLAYLIST,
} from "../../modules/smoothy";
import { ObjectType } from "../common/common";
import logger from "../custom-logger/logger";
import { getCurrentUser, signInSmoothyUser, sessionId } from "./auth";
import {
  FirestoreProfile,
  Friend,
  FullscreenEffect,
  PartyMember,
  YoutubePlayback,
} from "./types";

export let friends = new Map<string, Friend>();
let friendsChanged = false;

// subscribe 시작하고 종료 콜백을 저장
let closeSubscribingPartyMember: () => void;
let closeSubscribingFriend: () => void;
let closeSubscribingOnAuthChange: () => void;
let closeSubscribeMyProfile: () => void;
let partyEffectRoomRef: firebase.default.database.Reference;
let partyEffectRef: firebase.default.database.Reference;
let youtubeRef: firebase.default.database.Reference;
let youtubeVideoListRef: firebase.default.database.Reference;

// 저장된 종료 콜백을 트리거
export function unsbscribePartyMember(dispatch: Dispatch<any>) {
  logger("unsbscribePartyMember");
  if (typeof closeSubscribingPartyMember === "function")
    closeSubscribingPartyMember();
  dispatch({ type: CLEAR_PARTY_MEMBERS });
}
export function unsbscribeFriends() {
  logger("unsbscribeFriends", closeSubscribingFriend);
  if (typeof closeSubscribingFriend === "function") closeSubscribingFriend();
  // closeSubscribingFriend();
}
export function unsbscribeAuthChange() {
  logger("unsbscribeAuthChange");
  if (typeof closeSubscribingOnAuthChange === "function")
    closeSubscribingOnAuthChange();
}
// realtime database
export function unsubscribePartyroomEffect() {
  logger("unsubscribePartyroomEffect");
  if (partyEffectRoomRef) partyEffectRoomRef.off();
}
export function unsubscribePartyEffect() {
  logger("unsubscribePartyEffect");
  if (partyEffectRef) partyEffectRef.off();
}
export function unsubscribeYoutube(dispatch: Dispatch<any>) {
  logger("unsubscribeYoutube");
  if (youtubeRef) youtubeRef.off();
  if (youtubeVideoListRef) youtubeVideoListRef.off();
  dispatch({ type: CLEAR_PLAYBACK });
}
export function unsbscribeMyProfile() {
  logger("unsbscribeMyProfile", closeSubscribeMyProfile);
  if (typeof closeSubscribeMyProfile === "function") closeSubscribeMyProfile();
}

export function getFriends() {
  // logger("getFriends");
  if (friendsChanged) {
    friendsChanged = false;
    return friends;
  }
}

//
// subscribe realtime database
export function subscribePartyroomEffect(
  partyId: string,
  dispatch: Dispatch<any>
) {
  logger("subscribePartyroomEffect start");
  partyEffectRoomRef = firebaseDatabase().ref("party_effect_room/" + partyId);
  partyEffectRoomRef.on("value", (snapshot) => {
    const data = snapshot.exportVal();
    if (data && data.fullscreen) {
      const effect = data.fullscreen as FullscreenEffect;
      logger("subscribePartyroomEffect data -> ", effect);
      dispatch({ type: ADD_FULLSCREEN_EFFECT, payload: effect });
    } else {
      logger("empty data", data);
    }
  });
}

// 망치류
export function subscribePartyEffect(partyId: string, dispatch: Dispatch<any>) {
  logger("subscribePartyEffect start");
  partyEffectRef = firebaseDatabase().ref("party_effect/" + partyId);
  partyEffectRef.on("value", (snapshot) => {
    const data = snapshot.exportVal() as ObjectType;
    // logger('typeof data , data' , typeof data , data)
    if (data) {
      const keys = Object.keys(data);
      const currentUid = getCurrentUser()?.uid;
      keys.forEach((key) => {
        const effect = data[key];
        if (
          effect &&
          effect.view_transform &&
          effect.view_transform.sender !== currentUid
        ) {
          const transform = effect.view_transform as FullscreenEffect;
          transform.target = key;
          logger("subscribePartyEffect data -> ", transform, currentUid);
          if (transform.sender !== currentUid)
            dispatch({ type: ADD_FULLSCREEN_EFFECT, payload: transform });
        } else {
          logger("empty data", effect);
        }
      });
    }
  });
}

//
// subscribe auth
var session: firebase.default.User | null;
var isSignOutCalled: boolean = false;
export function signOutCalled() {
  isSignOutCalled = true;
}
export function onAuthStateChanged(dispatch: Dispatch<any>) {
  logger("onAuthStateChanged");
  // let uid:string|null = null
  closeSubscribingOnAuthChange = firebaseAuth().onAuthStateChanged(
    async function (user) {
      logger("[onAuthStateChanged] auth changed", user);
      if (user !== null) {
        user.providerData.forEach((profile) => {
          if (profile) {
            logger("Sign-in provider: " + profile.providerId);
            logger("  Provider-specific UID: " + profile.uid);
            logger("  Name: " + profile.displayName);
            logger("  Email: " + profile.email);
            logger("  Photo URL: " + profile.photoURL);
            if (profile.displayName)
              store.dispatch({type:SET_FIREBASE_PROFILE,payload:profile})
          }
        });
      }
      if (user) {
        // User is signed in.
        // const dbProfile = await getCurrentUserData(user.uid as string);
        // if (dbProfile && dbProfile.username) {
        //   logger("[onAuthStateChanged] user signed in", user);
        //   const smoothyUser: SmoothyUser = dbProfile as SmoothyUser;
        //   // uid = smoothyUser.key
        //   dispatch({ type: SIGN_IN, payload: smoothyUser });
        // } else {
        //   // dispatch({type:SET_SIGN_IN_USER,payload:null})
        //   console.error('[onAuthStateChanged] no username')
        //   afterUserOut();
        //   // uid = null;
        // }
        if (!session) {
          signInSmoothyUser(user.uid, dispatch);
          session = user;
        }
      } else {
        // No user is signed in.
        // logger('user not signed in')
        // dispatch({type:SET_SIGN_IN_USER,payload:null})
        console.info("[onAuthStateChanged] no user");
        if (session) {
          console.warn("[onAuthStateChanged] session exists, but empty user");
          session = null;
          if (isSignOutCalled === false) {
            // alert('Forcefully signed out by someother. please try one more sign in')
            dispatch({
              type: SET_ALERT_SNACKBAR,
              payload: {
                severity: AlertSeverityProvider.error,
                alertMessage: `Please check if your account is activated in other tab or app`,
              },
            });
            setTimeout(() => {
              window.location.reload(); // 같은 브라우저에서 다른탭으로 다시 로그인하는 경우 로그인되어있던 다른탭이 sign out 하여 이 경우가 발생하므로 새로고침해준다.
            }, 3000);
          } else {
            isSignOutCalled = false;
          }
          // signOut()
        }
        afterUserOut();
        // uid = null
      }
    },
    (error) => {
      console.error("[onAuthStateChanged] error", error);
    }
  );
}
function afterUserOut() {
  console.warn("user not signed in");
}

//
// subscribe firestore
export function subscribePartyMembers(
  partyId: string,
  dispatch: Dispatch<any>
) {
  logger(`subscribePartyMembers ${partyId}`);

  closeSubscribingPartyMember = firebaseFirestore()
    .collection("party_members")
    .doc(partyId)
    .collection("members")
    .onSnapshot(
      function (querySnapshot) {
        // var partyMembers: Array<PartyMember> = [];
        querySnapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const added = ({
              key: change.doc.data().key,
              content: change.doc.data().content,
              speaker: change.doc.data().speaker,
              timestamp: change.doc.data().timestamp,
              typing: change.doc.data().typing,
              video: change.doc.data().video,
              status: change.doc.data().status,
            } = change.doc.data() as PartyMember);
            dispatch({ type: ADD_PARTY_MEMBER, payload: added });
          }
          if (change.type === "modified") {
            const modified = ({
              key: change.doc.data().key,
              content: change.doc.data().content,
              speaker: change.doc.data().speaker,
              timestamp: change.doc.data().timestamp,
              typing: change.doc.data().typing,
              video: change.doc.data().video,
              status: change.doc.data().status,
            } = change.doc.data() as PartyMember);
            dispatch({ type: MODIFY_PARTY_MEMBER, payload: modified });
          }
          if (change.type === "removed") {
            const removed = ({
              key: change.doc.data().key,
              content: change.doc.data().content,
              speaker: change.doc.data().speaker,
              timestamp: change.doc.data().timestamp,
              typing: change.doc.data().typing,
              video: change.doc.data().video,
              status: change.doc.data().status,
            } = change.doc.data() as PartyMember);
            dispatch({ type: REMOVE_PARTY_MEMBER, payload: removed });
          }
        });
      },
      (error) => {
        logger("subscribePartyMembers", error);
      }
    );
}

export function subscribeFriendList() {
  logger(`subscribeFriendList`);
  friends = new Map<string, Friend>();
  closeSubscribingFriend = firebaseFirestore()
    .collection("friend_list")
    .doc(getCurrentUser()?.uid)
    .collection("members")
    .onSnapshot(
      function (querySnapshot) {
        // var partyMembers: Array<PartyMember> = [];
        querySnapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            const added = change.doc.data() as Friend;
            friends.set(added.key, added);
            friendsChanged = true;
          }
          if (change.type === "modified") {
            const modified = change.doc.data() as Friend;
            friends.set(modified.key, modified);
            friendsChanged = true;
          }
          if (change.type === "removed") {
            const removed = change.doc.data() as Friend;
            friends.delete(removed.key);
            friendsChanged = true;
          }
        });
      },
      (error) => {
        logger("subscribeFriendList", error);
      }
    );
}

// 유튜브
export function subscribeYoutube(partyId: string, dispatch: Dispatch<any>) {
  logger("subscribeYoutube start");
  youtubeRef = firebaseDatabase().ref("party_video/" + partyId);
  youtubeRef.on("value", (snapshot) => {
    const data = snapshot.exportVal() as ObjectType;
    // logger('typeof data , data' , typeof data , data)
    if (data) {
      const keys = Object.keys(data);
      logger("[subscribeYoutube youtubeRef] keys:: ", keys);
      keys.forEach((key) => {
        if (key === "playback") {
          const playback = data[key];
          if (playback) {
            logger(
              "[subscribeYoutube youtubeRef] subscribeYoutube data -> ",
              playback
            );
            dispatch({
              type: SET_PLAYBACK,
              payload: playback as YoutubePlayback,
            });
          } else {
            logger("[subscribeYoutube youtubeRef]empty data", playback);
            dispatch({ type: SET_PLAYBACK, payload: null });
          }
        }
      });
    } else {
      dispatch({ type: SET_PLAYBACK, payload: null });
    }
  });

  youtubeVideoListRef = firebaseDatabase().ref("party_video_list/" + partyId);
  youtubeVideoListRef.on("value", (snapshot) => {
    const data = snapshot.exportVal() as ObjectType;
    // logger('[subscribeYoutube youtubeVideoListRef] typeof data , data' , typeof data , data)
    if (data) {
      const keys = Object.keys(data);
      keys.forEach((key) => {
        logger("[subscribeYoutube youtubeVideoListRef] keys:: ", keys);
        if (key === "waitlist") {
          const waitlist = data[key];
          const waitlistKeys = Object.keys(waitlist);
          const youtubePlayList = waitlistKeys.map((wKey) => {
            return { ...waitlist[wKey], videoItem: wKey };
          });
          if (youtubePlayList.length > 0) {
            logger(
              "[subscribeYoutube youtubeVideoListRef] set playlist:: ",
              youtubePlayList
            );
            dispatch({ type: SET_PLAYLIST, payload: youtubePlayList });
          } else {
            logger(
              "[subscribeYoutube youtubeVideoListRef] empty playlist:: ",
              youtubePlayList
            );
            dispatch({ type: SET_PLAYLIST, payload: null });
          }
        }
      });
    } else {
      dispatch({ type: SET_PLAYLIST, payload: null });
    }
  });
}

export function subscribeMyProfile() {
  const uid = getCurrentUser()?.uid;
  logger(`[subscribeMyProfile] ${uid}`);

  if (uid) {
    closeSubscribeMyProfile = firebaseFirestore()
      .collection("profiles")
      .doc(uid)
      .onSnapshot(function (querySnapshot) {
        const snapshot = querySnapshot.data();
        logger("[subscribeMyProfile]", snapshot);
        const dispatch = store.dispatch;
        dispatch({
          type: SET_MY_PROFILE,
          payload: snapshot as FirestoreProfile,
        });
        if (!isSignOutCalled && snapshot) {
          if (snapshot.sessionId !== sessionId) {
            logger(
              "[subscribeMyProfile] This session is expired",
              snapshot.sessionId,
              sessionId
            );
            dispatch({
              type: SET_ALERT_SNACKBAR,
              payload: {
                severity:
                  AlertSeverityProvider.error as unknown as AlertSnackbarSeverity,
                alertMessage: `This session is expired`,
              },
            });
            dispatch({ type: SIGN_OUT, payload: uid });
          } else if (snapshot.online === true) {
            // logger('App running at the same time is not allowed')
            dispatch({
              type: SET_ALERT_SNACKBAR,
              payload: {
                severity:
                  AlertSeverityProvider.error as unknown as AlertSnackbarSeverity,
                alertMessage: `App running at the same time is not allowed`,
              },
            });
            dispatch({ type: SIGN_OUT, payload: uid });
          }
        }
      });
  } else {
    console.error("[subscribeMyProfile] no user signed in");
  }
}
