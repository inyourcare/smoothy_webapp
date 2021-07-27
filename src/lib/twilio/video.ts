import {
  connect,
  createLocalVideoTrack,
  LocalAudioTrack,
  LocalTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteTrack,
  RemoteVideoTrack,
  Room,
} from "twilio-video";
import { store } from "../..";
import { AlertSnackbarSeverity } from "../../components/snackbar/AlertSnackbar";
import {
  AlertSeverityProvider,
  SET_ALERT_SNACKBAR,
} from "../../modules/smoothy";
import {
  ADD_AUDIO_ENABLED,
  ADD_VIDEO_ENABLED,
  REMOVE_AUDIO_ENABLED,
  REMOVE_VIDEO_ENABLED,
} from "../../modules/twilio";
import logger from "../custom-logger/logger";
import { getCurrentUser } from "../firebase";
import {
  AttachedClassNameProvider,
  ConnectToARoomPayload,
  Nullable,
} from "./types";
import firebase from "firebase";

let chatTime:number;
// const identitySpaceMap = new Map<string,HTMLElement>()
const tracksMap = new Map<
  string,
  RemoteAudioTrack | RemoteVideoTrack | LocalAudioTrack | LocalVideoTrack
>();
export function getTrackMap() {
  return tracksMap;
}
export function onOffTrack(
  identity: string,
  kind: "audio" | "video",
  onOff: boolean
) {
  const track = tracksMap.get(`${identity}-${kind}`) as
    | LocalAudioTrack
    | LocalVideoTrack;
  if (!isLocalTrack(track)) return;
  if (onOff === true) {
    track.enable();
    const dispatch = store.dispatch;
    if (track.kind === "video")
      dispatch({ type: ADD_VIDEO_ENABLED, payload: identity });
    if (track.kind === "audio")
      dispatch({ type: ADD_AUDIO_ENABLED, payload: identity });
  } else {
    track.disable();
    const dispatch = store.dispatch;
    if (track.kind === "video")
      dispatch({ type: REMOVE_VIDEO_ENABLED, payload: identity });
    if (track.kind === "audio")
      dispatch({ type: REMOVE_AUDIO_ENABLED, payload: identity });
  }
}

function attachTrack(
  track:
    | RemoteAudioTrack
    | RemoteVideoTrack
    | LocalAudioTrack
    | LocalVideoTrack,
  identity: string
) {
  const wrapper = document.createElement(`div`);
  wrapper.appendChild(track.attach());

  // const identitySpace =  document.querySelector(`#${identity}`);
  const identitySpace = document.getElementById(identity);
  // if (!identitySpace?.classList.contains(`${track.kind}-attached`)) {
  if (
    !identitySpace?.classList.contains(AttachedClassNameProvider[track.kind])
  ) {
    identitySpace?.appendChild(wrapper);
    // identitySpace?.classList.add(`${track.kind}-attached`); // 로딩화면에서 video-attached className 을 훅으로 하기 때문에 수정시 조심
    identitySpace?.classList.add(AttachedClassNameProvider[track.kind]); // 로딩화면에서 video-attached className 을 훅으로 하기 때문에 수정시 조심
    // if (track.isEnabled){
    //   identitySpace?.classList.add(`${track.kind}-enabled`)
    // }
    // trackMap set for disabling
    // if (identitySpace)
    //   identitySpaceMap.set(`${identity}` , identitySpace)
    tracksMap.set(`${identity}-${track.kind}`, track);

    const dispatch = store.dispatch;
    if (track.isEnabled === true) {
      if (track.kind === "video")
        dispatch({ type: ADD_VIDEO_ENABLED, payload: identity });
      if (track.kind === "audio")
        dispatch({ type: ADD_AUDIO_ENABLED, payload: identity });
    }
  }
}
function attachAttachableTrack(track: RemoteTrack | null, identity: string) {
  if (!trackExistsAndIsAttachable(track)) return;
  attachTrack(track, identity);
}

function trackEnableLisntener(track: RemoteTrack | null, identity: string) {
  track?.on("enabled", () => {
    logger(`${identity}'s ${track.kind} is enabled`);
    // const identitySpace = identitySpaceMap.get(`${identity}`)
    // if (identitySpace) {
    //   identitySpace.classList.add(`${track.kind}-enabled`)
    // }
    const dispatch = store.dispatch;
    if (track.kind === "video")
      dispatch({ type: ADD_VIDEO_ENABLED, payload: identity });
    if (track.kind === "audio")
      dispatch({ type: ADD_AUDIO_ENABLED, payload: identity });
  });
  track?.on("disabled", () => {
    logger(`${identity}'s ${track.kind} is diabled`);
    // const identitySpace = identitySpaceMap.get(`${identity}`)
    // if (identitySpace) {
    //   identitySpace.classList.remove(`${track.kind}-enabled`)
    // }
    const dispatch = store.dispatch;
    if (track.kind === "video")
      dispatch({ type: REMOVE_VIDEO_ENABLED, payload: identity });
    if (track.kind === "audio")
      dispatch({ type: REMOVE_AUDIO_ENABLED, payload: identity });
  });
}
export function attachTrackToHTML(room: Room) {
  logger("attach remote tracks");
  const localIdentity = room.localParticipant.identity;

  room.localParticipant.tracks.forEach((trackPublication) => {
    const track = trackPublication.track as LocalAudioTrack | LocalVideoTrack;
    attachTrack(track, localIdentity);
  });
  room.participants.forEach((participant) => {
    // Handle tracks that this participant has already published.
    participant.tracks.forEach((publication) => {
      if (!publication.isSubscribed) return;
      attachAttachableTrack(publication.track, participant.identity);
      trackEnableLisntener(publication.track, participant.identity);
    });

    // Handles tracks that this participant eventually publishes.
    participant.on("trackSubscribed", (track) => {
      attachAttachableTrack(track, participant.identity);
      trackEnableLisntener(track, participant.identity);
    });
  });
  room.on("participantConnected", (participant) => {
    participant.on("trackSubscribed", (track) => {
      attachAttachableTrack(track, participant.identity);
      trackEnableLisntener(track, participant.identity);
    });
  });
}

// function removeTrack(track: RemoteAudioTrack | RemoteVideoTrack | LocalAudioTrack | LocalVideoTrack){
//   track.detach().forEach((element) => {
//     const parentElem = element.parentElement
//     element.remove()
//     parentElem?.remove()
//   });
// }

// 외부용
export async function provideOwnMedia(elem: HTMLElement | null) {
  const dispatch = store.dispatch;
  // Provides a camera preview window.
  const localVideoTrack = await createLocalVideoTrack({ width: 640 }).catch(
    function (error) {
      console.error("[provideOwnMedia] err while createLocalVideoTrack", error);
      // alert(
      //   "video track 을 가져올 수 없습니다. 다른 앱에서 사용중인지 확인해 주세요."
      // );
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity:
            AlertSeverityProvider.error as unknown as AlertSnackbarSeverity,
          alertMessage: `video track 을 가져올 수 없습니다. 다른 앱에서 사용중인지 확인해 주세요.`,
        },
      });
    }
  );
  if (localVideoTrack) {
    logger("[provideOwnMedia] createLocalVideoTrack::", localVideoTrack);
    // if (!elem?.classList.contains("video-attached")) {
    if (!elem?.classList.contains(AttachedClassNameProvider["video"])) {
      const currentUid = getCurrentUser()?.uid as string;
      // elem?.classList.add("video-attached");
      elem?.classList.add(AttachedClassNameProvider["video"]);
      elem?.appendChild(localVideoTrack.attach());

      tracksMap.set(`${currentUid}-${localVideoTrack.kind}`, localVideoTrack);
      dispatch({ type: ADD_VIDEO_ENABLED, payload: currentUid });
    }
    // removeLocalVideoTrack(localVideoTrack)
    return localVideoTrack;
  } else {
    return localVideoTrack;
  }
}
export function removeLocalVideoTrack(localVideoTrack: LocalVideoTrack) {
  localVideoTrack.stop();
  localVideoTrack?.detach().forEach((element) => {
    const parentElem = element.parentElement;
    element.remove();
    // parentElem?.classList.remove("video-attached");
    parentElem?.classList.remove(AttachedClassNameProvider["video"]);

    const dispatch = store.dispatch;
    const currentUid = getCurrentUser()?.uid as string;
    dispatch({ type: REMOVE_VIDEO_ENABLED, payload: currentUid });
  });
}

/**
 * Triggers when the join button is clicked.
 */
export function connectToARoom({
  token,
  roomName,
}: ConnectToARoomPayload): Promise<Room> {
  return connect(token, {
    name: roomName,
    audio: true,
    video: { width: 640 },
  }).then((result) => {
    chatTime = new Date().getTime();
    return result;
  });
}

export function disconnectToARoom(room: Room) {
  logger("disconnect room ->", room);
  room.disconnect();
  const spentTime = new Date().getTime() - chatTime;
  chatTime = 0

  if (spentTime > 30000)
    firebase.analytics().logEvent("v2_chat_end ", {
      uid: getCurrentUser()?.uid,
      numOfMember: store.getState().smoothy.videoChatUserProfiles.size,
      timeSpent: spentTime,
    });
  return null;
}

export function changeDevice(kind: string, deviceId: string) {
  // logger("[changeDevice]", kind, deviceId);
  // const identity = getCurrentUser()?.uid;
  // const track = tracksMap.get(`${identity}-${kind}`) as
  //   | LocalAudioTrack
  //   | LocalVideoTrack;
  // if (!isLocalTrack(track)) return;
  // if (identity && track) {
  //   if (kind === "video") {
  //     const videoElem = track.attach();
  //     // videoElem
  //     // HTMLMediaElement.s
  //     const audio = document.createElement('audio');
  //     await audio.setSinkId(audioDevices[0].deviceId);
  //   } else if (kind === "audio") {
  //   }
  // }
}

/**
 * Guard that a track is attachable.
 *
 * @param track
 * The remote track candidate.
 */
function trackExistsAndIsAttachable(
  track?: Nullable<RemoteTrack>
): track is RemoteAudioTrack | RemoteVideoTrack {
  return (
    !!track &&
    ((track as RemoteAudioTrack).attach !== undefined ||
      (track as RemoteVideoTrack).attach !== undefined)
  );
}

function isLocalTrack(
  track?: Nullable<LocalTrack>
): track is LocalAudioTrack | LocalVideoTrack {
  return (
    !!track &&
    ((track as LocalAudioTrack).disable !== undefined ||
      (track as LocalAudioTrack).disable !== undefined)
  );
}
