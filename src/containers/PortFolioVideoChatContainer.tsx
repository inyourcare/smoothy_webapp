import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import LeaveRoomDialog from "../components/dialogs/LeaveRoomDialog";
import NotArrivedVideoBox from "../components/video-chat/NotArrivedVideoBox";
import YoutubeVideoDetail from "../components/youtube/YoutubeVideoDetail";
import {
  appendFullscreenReaction,
  defaultOnBeforeUnload,
} from "../lib/common/common";
import constants from "../lib/common/constants";
import {
  divHitByHammerAction,
  getBackToOriginalSizeAfterHammerHit,
  getHeightForVideoSpace,
} from "../lib/common/twilio-video-chat";
import logger from "../lib/custom-logger/logger";
import { FirestoreProfile } from "../lib/firebase";
import { RootState } from "../modules";
import {
  SET_YOUTUBE_DIV_WITH_HEIGHT,
  TwilioVideoChatProps,
} from "../modules/smoothy";
import { SET_IS_TWILIO_CHATROOM_ON } from "../modules/twilio";

const SmoothyVideoFrameLayout = styled.div`
  display: flex;
  background-color: black;

  .${constants.videoChat.components.container} {
    position: relative;
    height: 100vh;
    flex-grow: 1;
  }

  #${constants.videoChat.components.subContainer} {
    min-width: 480px;
    min-height: 270px;
    max-width: 100vw;
    max-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .${constants.videoChat.components.individual.view} {
    position: relative;
  }
  .${constants.videoChat.components.individual.view}-wrapper {
    overflow: hidden;
    flex-grow: 1;
    /* border: 5px solid blue; */
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: flex-end;
  }

  /* .video-enabled .video-off{
    display:block;
  }
  .video-enabled .video-on{
    display:none;
  }
  .audio-enabled .audio-off{
    display:block;
  }
  .audio-enabled .audio-on{
    display:none;
  } */

  video {
    min-width: 100%;
    object-fit: cover;
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
    min-height: 100%;
  }

  .${constants.videoChat.mode.eachScreenAndHammerMode} .video-attached:hover {
    /* opacity: 1; */
    cursor: pointer;
  }

  /* .loading {
    background-color:black;
  } */

  .${constants.videoChat.components.individual.view} {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .leave-room-dialog-div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .img-div {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  .img-wrapper-div {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
`;

const PortfolioTestButtonSpaceStyle = styled.div`
  .effect-space {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: ${constants.smoothy.zidx.btn};
    /* display: none; */
  }
  .ative-effect-btn {
    background-color: yellowgreen;
  }
`;

function isTwilioVideoChatProps(
  result: TwilioVideoChatProps
): result is TwilioVideoChatProps {
  if (result && result.partyNo && result.sender) return true;
  else return false;
}
// type TwilioVideoChatContainerProps = {
//   partyNo: string;
//   sender: string;
//   chatlink?: string;
// };
type PortFolioVideoChatContainerProps = {
  setOnBeforeUnload: React.Dispatch<
    React.SetStateAction<(event: Event) => void>
  >;
};
function PortFolioVideoChatContainer({
  setOnBeforeUnload,
}: PortFolioVideoChatContainerProps) {
  //
  // definitions
  const { partyMembers, friends, fullscreenEffect } = useSelector(
    (state: RootState) => state.firebase
  );
  // const {
  //   roomConnected,
  //   twilioVideoChatProps,
  //   youtube,
  //   eachscreen,
  //   pingListMap,
  //   youtubeVideoDivWidthHeight,
  // } = useSelector((state: RootState) => state.smoothy);
  // const { partyNo, sender, chatlink } =
  //   twilioVideoChatProps as TwilioVideoChatProps;
  // const { video_enabled, selectedVideoDevice, selectedAudioDevice } =
  //   useSelector((state: RootState) => state.twilio);
  const [portfolioTestActivated, setPortfolioTestActivated] = useState(false);
  const [hammerMode, setHammerMode] = useState(false);
  const [youtubeMode, setYoutubeMode] = useState(false);
  const [youtubeVideoDivWidthHeight, setYoutubeVideoDivWidthHeight] = useState({
    width: 0,
    height: 0,
  });
  const [video_enabled, setVideo_enabled] = useState(["__quniqueId__1"]);
  const [actualUsers, setActualUsers] = useState(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3"]);
  const [userProfiles, setUserProfiles] = useState(
    new Map<string, FirestoreProfile>()
  );
  // const [youtubeVideoDivHeight, setYoutubeVideoDivHeight] = useState(0); //vh

  // const [roomConnected, setRoomConnected] = useState((null as unknown) as Room);
  // const [disconnectDisabled, setDisconnectDisabled] = useState(true);
  const dispatch = useDispatch();

  // leave room
  const [leaveRoomDialogOpen, setLeaveRoomDialogOpen] = useState(false);

  const history = useHistory();
  // const { partyNo, chatlink, sender } = history.location.state as HistoryProps;
  // const { partyNo, chatlink, sender } = isHistoryProps(
  //   history.location.state as HistoryProps
  // )
  //   ? (history.location.state as HistoryProps)
  //   : {
  //       partyNo: "",
  //       chatlink: "",
  //       sender: "",
  //     };

  // 흔들기
  const [wiggleTimer, setWiggleTimer] = useState(
    undefined as unknown as NodeJS.Timeout
  );
  // 망치 타이머들
  const [hammerTimerMap] = useState(new Map<string, NodeJS.Timeout>());

  const partyMemberCount = useRef(partyMembers.size);
  // hammer
  const [hammerIntervalsList] = useState(new Array<number>());
  const [hmmerCntMap] = useState(new Map<string, number>());

  //
  // callback
  const disconnectARoom = useCallback(() => {
    // if (partyNo) preprocessToDisconnect(partyNo, dispatch);
    // if (roomConnected) {
    //   // roomConnected.disconnect();
    //   disconnectToARoom(roomConnected)
    //   dispatch({ type: CLEAR_TWILIO_VIDEOCHAT_PROPS });
    //   dispatch({ type: CLEAR_ROOM_CONNECTED });
    // }

    // onBeforeUnload set
    // disconnect 하면서 기존의 onBeforeUnload 로 바꿔줘야함
    setOnBeforeUnload(defaultOnBeforeUnload);
    history.push("/");
    // }, [dispatch, history, partyNo, roomConnected, setOnBeforeUnload]);
  }, [history, setOnBeforeUnload]);

  const getContainerElem = useCallback(
    () =>
      document.getElementsByClassName(
        constants.videoChat.components.container
      )[0] as HTMLDivElement,
    []
  );

  // const fullscreenHammerEffectOnClick = useCallback(() => {
  //   if (eachscreen.hammer === true)
  //     dispatch({ type: DEACTIVATE_EACH_SCREEN_HAMMER_MODE });
  //   else dispatch({ type: ACTIVATE_EACH_SCREEN_HAMMER_MODE });
  // }, [dispatch, eachscreen.hammer]);

  // 망치 맞았을 때
  const divHitByHammer = useCallback(
    (e: HTMLDivElement) => {
      const parent = e.parentElement as HTMLDivElement;
      // const grandParent = parent.parentElement as HTMLDivElement;
      const widthScale = 0.8;
      const heigthScale = 0.7;
      let cnt = hmmerCntMap.get(e.id);
      if (!cnt) cnt = 0;
      hmmerCntMap.set(e.id, ++cnt);
      const minWidth = parent.clientWidth * Math.pow(widthScale, cnt);
      const minHeight = parent.clientHeight * Math.pow(heigthScale, cnt);
      if (hammerIntervalsList.length) {
        while (hammerIntervalsList.length) {
          const idx = hammerIntervalsList.pop();
          window.clearInterval(idx);
        }
        e.style.width = minWidth + "px";
        e.style.height = minHeight + "px";
      }
      if (parent.style.backgroundColor === "blue")
        parent.style.backgroundColor = "green";
      else parent.style.backgroundColor = "blue";
      // logger("cnt,minwidth,minheight->" , cnt , minWidth,minHeight)
      divHitByHammerAction(
        e,
        hammerIntervalsList,
        widthScale,
        heigthScale,
        minWidth,
        minHeight
      );
    },
    [hammerIntervalsList, hmmerCntMap]
  );
  // 다시 돌아올 때
  const getBackToOriginalSize = useCallback(
    (e: HTMLDivElement) => {
      getBackToOriginalSizeAfterHammerHit(e);
      // if (partyNo)
      //   removeHammerReaction(partyNo, getCurrentUser()?.uid as string);
      hmmerCntMap.set(e.id, 0);
    },
    // [hmmerCntMap, partyNo]
    [hmmerCntMap]
  );

  const hammerAction = useCallback(
    (element) => {
      divHitByHammer(element);
      clearTimeout(hammerTimerMap.get(element.id) as unknown as NodeJS.Timeout);
      hammerTimerMap.set(
        element.id,
        setTimeout(() => {
          getBackToOriginalSize(element);
        }, 4000)
      );
    },
    [divHitByHammer, getBackToOriginalSize, hammerTimerMap]
  );

  // const profileUpdate = useCallback(() => {
  //   const promises = new Array<Promise<any>>();
  //   actualUsers.forEach((uid) => {
  //     if (uid) {
  //       logger("[actualUserProfilesEffect] getProgfile", uid);
  //       promises.push(
  //         getProgfile(uid).then((profile) => {
  //           setUserProfiles(userProfiles.set(uid, profile));
  //         })
  //       );
  //     }
  //   });
  //   Promise.all(promises).then(() => {
  //     dispatch({ type: SET_VIDEOCHAT_USER_PROFILES, payload: userProfiles });
  //   });
  // }, [actualUsers, dispatch, userProfiles]);

  //
  // onBeforeUnload 수정용
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onBeforeUnloadEffect = useEffect(() => {
  //   // onBeforeUnload set
  //   setOnBeforeUnload(() => (event: Event) => {
  //     logger("[PortFolioVideoChatContainer] commonClose");
  //     commonClose(
  //       dispatch,
  //       event,
  //       disconnectARoom,
  //       partyNo ? partyNo : undefined
  //     );
  //   });
  // }, [disconnectARoom, dispatch, setOnBeforeUnload, partyNo]);
  //
  // effect 처음 들어왔을 때
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    dispatch({ type: SET_IS_TWILIO_CHATROOM_ON, payload: true });
    // if (
    //   isTwilioVideoChatProps({
    //     partyNo,
    //     chatlink,
    //     sender,
    //   } as TwilioVideoChatProps) === false
    // ) {
    //   // alert("잘못된 경로로 진입하였습니다.");
    //   dispatch({
    //     type: SET_ALERT_SNACKBAR,
    //     payload: {
    //       severity: AlertSeverityProvider.error,
    //       alertMessage: `잘못된 경로로 진입하였습니다.`,
    //     },
    //   });
    //   history.goBack();
    // }
    // 이 useEffect 는 처음 실행할 때 한번만 실행한다.
    // history 로 넘어올때 sender, chatlink, partyNo 모두 만들어져서 들어와야한다.
    // setDisconnectDisabled(true);
    // videochat
    // if (chatlink)
    //   connectToPartyWithChatlink(
    //     partyNo,
    //     sender,
    //     setDisconnectDisabled,
    //     dispatch
    //   );
    // else
    // connectToParty(partyNo, sender, setDisconnectDisabled, dispatch);
    // if (partyNo && sender) connectToParty(partyNo, sender, dispatch);

    return () => {
      setActualUsers([""]);
      setUserProfiles(new Map<string, FirestoreProfile>());
      dispatch({ type: SET_IS_TWILIO_CHATROOM_ON, payload: false });
    };
    // }, [chatlink, dispatch, history, partyNo, sender]);
  }, [dispatch, history]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const observePartyMembersEffect = useEffect(() => {
  //   // logic 1
  //   // 방에 나혼자 남았을 때 나가는로직
  //   const prevRef = partyMemberCount.current;
  //   partyMemberCount.current = partyMembers.size;
  //   logger(
  //     "[observePartyMembersEffect] prevRef::",
  //     prevRef,
  //     "current::",
  //     partyMemberCount.current
  //   );
  //   logger("[observePartyMembersEffect] partyMembers -> ", partyMembers);
  //   logger("[observePartyMembersEffect] pingListMap -> ", pingListMap);
  //   if (partyMemberCount.current < prevRef && partyMemberCount.current === 1) {
  //     disconnectARoom();
  //     return;
  //   }
  //   // logic 2
  //   // 방 참여자중 친구가 아닌 사람은 친구로
  //   // 실패해도 상관 없으니까 한번만 보내자
  //   if (
  //     Array.from(partyMembers.keys()).filter(
  //       (partyMemberKey) => !friends.get(partyMemberKey)
  //     ).length > 0
  //   ) {
  //     logger("새로운 친구가 들어옴");
  //     if (chatlink)
  //       beFriendEachotherWithOpenchatlink(
  //         getCurrentUser()?.uid as string,
  //         chatlink
  //       ).then(function (result) {
  //         logger(
  //           "[observePartyMembersEffect] befriend eachother result",
  //           result
  //         );
  //       });
  //   }
  //   // logic 3
  //   // 현재 채팅 참여자 수 집계
  //   const partyList = Array.from(partyMembers.keys());
  //   var list = partyList;
  //   if (partyNo)
  //     if (pingListMap.has(partyNo)) {
  //       // 핑 보낸 사람 중 come 이 false
  //       const pingList = pingListMap
  //         .get(partyNo)
  //         ?.filter((e) => !e.come)
  //         .map((e) => e.uid);
  //       logger("[observePartyMembersEffect] pingList -> ", pingList);
  //       if (pingList && pingList?.length > 0) {
  //         // Party member 에 없다면 아직 도착하지 않았음 loading 중
  //         const notArrivedList = pingList.filter((e) => !partyMembers.has(e));
  //         list = partyList.concat(notArrivedList); // -> actual user

  //         // Party member 에 있다면 도착함 , come 을 true 로 변경
  //         const arrivedList = pingList.filter((e) => partyMembers.has(e));
  //         arrivedList.forEach((e) => {
  //           pingListMap
  //             .get(partyNo)
  //             ?.filter((pingListElem) => pingListElem.uid === e)
  //             .forEach((pingListElem) => {
  //               pingListElem.come = true;
  //             });
  //         });
  //       }
  //     }
  //   logger("[observePartyMembersEffect] setActualUsers -> ", list);
  //   setActualUsers(list);
  //   dispatch({ type: SET_ACTUAL_USERS, payload: list });
  // }, [
  //   dispatch,
  //   chatlink,
  //   disconnectARoom,
  //   friends,
  //   partyMembers,
  //   partyMembers.size,
  //   partyNo,
  //   pingListMap,
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   pingListMap.get(partyNo as string),
  // ]);

  // fullscreen
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fullscreenEffectEffect = useEffect(() => {
    logger("fullscreen useEffect");
    while (fullscreenEffect.length > 0) {
      const effect = fullscreenEffect.shift();
      const reactionId = effect?.item as string;
      // logger("fullscreen useEffect inner", effect);
      if (reactionId === constants.reaction.fullscreen.shakeshake) {
        // getParentElement().style.animation = "";
        setTimeout(function () {
          // getParentElement().style.animation = "wiggle 1.65s infinite";
          getContainerElem().classList.add(constants.animation.wiggle);
          clearTimeout(wiggleTimer);
          setWiggleTimer(
            setTimeout(() => {
              // getParentElement().style.animation = "";
              getContainerElem().classList.remove(constants.animation.wiggle);
            }, 1650)
          );
        }, 100);
      } else if (reactionId === constants.reaction.eachscreen.hammer.img) {
        // document.getElementById(effect.)
        // hammerAction(element)
        if (effect?.target) {
          const targetDiv = document.getElementById(effect?.target);
          if (targetDiv) {
            hammerAction(targetDiv);
          }
        }
      } else {
        appendFullscreenReaction(reactionId, getContainerElem() as Element);
      }
    }
  }, [fullscreenEffect, getContainerElem, hammerAction, wiggleTimer]);

  // eachscreen hammer
  // hammer mode 변경시 각 element 에 관련 class 추가 및 제거 해주는 역할
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hammerModeTriggerEffect = useEffect(() => {
    // if (eachscreen.hammer === true) {
    if (hammerMode === true) {
      logger("eachScreenHammerMode is true");
      getContainerElem().classList.add(
        constants.videoChat.mode.eachScreenAndHammerMode
      );
      // Array.from(document.getElementsByClassName(constants.twilio.videoChat.layout.wrapperDiv)).forEach(
      Array.from(
        document.getElementsByClassName(
          constants.videoChat.components.individual.view
        )
      ).forEach((elem) => {
        const element = elem as HTMLDivElement;
        element.onclick = () => {
          logger("onclick", element.style.width, element.clientWidth);
          // if (partyNo)
          //   addHammerReaction(
          //     partyNo,
          //     element.id,
          //     constants.reaction.eachscreen.hammer.img,
          //     getCurrentUser()?.uid as string
          //   );
          hammerAction(element);
        };
      });
    } else {
      logger("eachScreenHammerMode is false");
      getContainerElem().classList.remove(
        constants.videoChat.mode.eachScreenAndHammerMode
      );
      // Array.from(document.getElementsByClassName(constants.twilio.videoChat.layout.wrapperDiv)).forEach((elem) => {
      Array.from(
        document.getElementsByClassName(
          constants.videoChat.components.individual.view
        )
      ).forEach((elem) => {
        const element = elem as HTMLDivElement;
        // element.style.opacity = "1";
        element.onclick = null;
      });
    }
  }, [
    // eachscreen.hammer,
    getBackToOriginalSize,
    getContainerElem,
    hammerAction,
    hammerTimerMap,
    partyMembers,
    // partyNo,
    hammerMode,
  ]); // partyMembers 파티 변할때 대비

  // //
  // // youtube
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const youtubeModeTriggerEffect = useEffect(() => {
  //   if (youtube.sharedVideoPlayback) {
  //     if (
  //       youtube.sharedVideoPlayback.sender !== getCurrentUser()?.uid &&
  //       youtubeMode === false
  //     )
  //       // 내가 만든게 아닌 경우에만 강제로 activate
  //       dispatch({ type: ACTIVATE_YOUTUBE });
  //   } else if (youtubeMode === true && !youtube.sharedVideoPlayback) {
  //     // 상대가 먼저 종료할 경우
  //     dispatch({ type: ACTIVATE_YOUTUBE });
  //   }
  // }, [dispatch, youtube.sharedVideoPlayback, youtubeMode]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const actualUserProfilesEffect = useEffect(() => {
  //   logger("[actualUserProfilesEffect] actualUsers", actualUsers);
  //   // actualUsers.forEach((uid) => {
  //   //   if (uid) {
  //   //     logger("[actualUserProfilesEffect] getProgfile", uid);
  //   //     getProgfile(uid).then((profile) => {
  //   //       if (!userProfiles.has(uid))
  //   //         setUserProfiles(userProfiles.set(uid, profile));
  //   //     });
  //   //   }
  //   // });
  //   profileUpdate();
  // }, [actualUsers, profileUpdate, userProfiles]);

  //
  // window close
  // useEffect(() => {
  //   window.onbeforeunload = (event: Event) => {
  //     logger('[twilioVideoChatContainer] commonClose')
  //     commonClose(dispatch, event, disconnectARoom);
  //   }
  // }, [disconnectARoom, dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const youtubeSelectedEffect = useEffect(() => {
    // if (youtube.selectedVideo) {
    if (false) {
      // setYoutubeVideoDivHeight(50);
      dispatch({
        type: SET_YOUTUBE_DIV_WITH_HEIGHT,
        payload: { width: 100, height: 33 },
      });
    } else {
      // setYoutubeVideoDivHeight(0);
      dispatch({
        type: SET_YOUTUBE_DIV_WITH_HEIGHT,
        payload: { width: 0, height: 0 },
      });
    }
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const userDeviceChangedEffect = useEffect(() => {
  //   logger(
  //     "[userDeviceChangedEffect] start",
  //     selectedVideoDevice,
  //     selectedAudioDevice
  //   );
  //   if (selectedVideoDevice) {
  //     changeDevice("video", selectedVideoDevice);
  //   }
  //   if (selectedAudioDevice) {
  //     changeDevice("audio", selectedAudioDevice);
  //   }
  // }, [selectedVideoDevice, selectedAudioDevice]);

  return (
    <>
      <SmoothyVideoFrameLayout>
        {/* {youtubeMode === true && partyNo && <YoutubeView partyId={partyNo} />} */}
        <div className={constants.videoChat.components.container}>
          <div id={constants.videoChat.components.subContainer}>
            {/* <YoutubeVideoDetail
                videoId={selectedVideo.id}
                title={selectedVideo.title}
                description={selectedVideo.description}
                // _onReady={onReadyForYTDetail}
                // _onEnd={onEndForYTDetail}
                // _onStateChange={onStateChangeForYTDetail}
                // player={player}
                partyId={partyId}
              /> */}
            {youtubeVideoDivWidthHeight.height > 0 && (
              <div
                style={{
                  // maxWidth: "640px",
                  maxWidth: "100%",
                  width: "100%",
                  height: `${youtubeVideoDivWidthHeight.height}vh`,
                  backgroundColor: "black",
                  // height: getHeightForVideoSpace(actualUsers.length),
                }}
              >
                {/* {partyNo && youtube.selectedVideo && ( */}
                {youtubeMode && (
                  <YoutubeVideoDetail
                    videoId={""}
                    title={"videotitle here"}
                    description={"video description here"}
                    // _onReady={onReadyForYTDetail}
                    // _onEnd={onEndForYTDetail}
                    // _onStateChange={onStateChangeForYTDetail}
                    // player={player}
                    partyId={undefined}
                  />
                )}
              </div>
            )}
            {
              // let width = "50%";
              // videoTrack.style.height = "50vh";
              // if (partyMembers.length > 4) videoTrack.style.height = "33vh";
              // if (partyMembers.length > 6) videoTrack.style.height = "25vh";
              // Array.from(partyMembers.values()).map((member) => (
              Array.from(actualUsers.values()).map((uid,num) => (
                // Array.from(['1','2','3'].values()).map((uid) => (
                <div
                  // key={member.key}
                  key={uid}
                  className={
                    constants.videoChat.components.individual.view + "-wrapper"
                  }
                  style={{
                    // maxWidth: "640px",
                    // maxWidth: "50%",
                    width: "50%",
                    height: getHeightForVideoSpace(
                      actualUsers.length,
                      youtubeVideoDivWidthHeight.height
                    ),
                    // height: getHeightForVideoSpace(actualUsers.length),
                  }}
                >
                  <div
                    // id={member.key}
                    id={uid}
                    className={constants.videoChat.components.individual.view}
                  >
                    {/* {member.key === (user as SmoothyUser).key ? (
                      <VideoChatIcon identity={member.key} /> */}
                    {/* {uid === (user as SmoothyUser).key ? (
                      <VideoChatIcon identity={uid} />
                    ) : null} */}
                    {/* partyMembers 로 hook 할 경우 twilio 가 video 를 붙이고나서도 반응이 느려서 classList 바라보게함
                    {partyMembers.has(uid)?null:(<><NotArrivedVideoBox profiles={userProfiles} uid={uid}/></>)} */}
                    {/* {document
                      .getElementById(uid)
                      ?.classList.contains(
                        AttachedClassNameProvider["video"] */}
                    {video_enabled.filter((elem) => elem === uid).length >
                    // 0 ? null : (
                    0 ? (
                      <div id={`${uid}`} className="img-div">
                        <div className="img-wrapper-div">
                          <img
                            // src={process.env.PUBLIC_URL + "/images/test2.jpg"}
                            src={process.env.PUBLIC_URL + `/images/test${num+1}.jpg`}
                            className="img-contain"
                            alt="test2"
                            style={{
                              // maxWidth: "640px",
                              // maxWidth: "50%",
                              width: "50%",
                              height: getHeightForVideoSpace(
                                actualUsers.length,
                                youtubeVideoDivWidthHeight.height
                              ),
                              // height: getHeightForVideoSpace(actualUsers.length),
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <NotArrivedVideoBox profiles={userProfiles} uid={uid} />
                      </>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* <CircleButton onClick={disconnectARoom} disabled={disconnectDisabled}> */}
        {/* <CircleButton
          onClick={() => setLeaveRoomDialogOpen(true)}
          disabled={disconnectDisabled}
        >
          X
        </CircleButton> */}
        {/* <EffectButtonSpace parent={()=>document.getElementById("multi-media-container")}/> */}
        {/* <EffectButtonSpace
          partyId={partyNo}
          fullscreenHammerEffectOnClick={fullscreenHammerEffectOnClick}
          youtubeMode={youtubeMode}
        /> */}
        <div className="leave-room-dialog-div">
          <LeaveRoomDialog
            leaveRoom={disconnectARoom}
            open={leaveRoomDialogOpen}
            setOpen={setLeaveRoomDialogOpen}
          />
        </div>
        <PortfolioTestButtonSpaceStyle>
          <div className="effect-space">
            <button
              className="ative-effect-btn"
              onClick={() => {
                setPortfolioTestActivated(!portfolioTestActivated);
              }}
            >
              test
            </button>
            {/* <button className="ative-effect-btn" onClick={test}>test!</button> */}
            {portfolioTestActivated === true && (
              <div>
                <button
                  className="btn"
                  onClick={(e) => setActualUsers(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3"])}
                >
                  make 3
                </button>
                <button
                  className="btn"
                  onClick={(e) => setActualUsers(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4"])}
                >
                  make 4
                </button>
                <button
                  className="btn"
                  onClick={(e) => setActualUsers(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5"])}
                >
                  make 5
                </button>
                <button
                  className="btn"
                  onClick={(e) =>
                    setActualUsers(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5", "__quniqueId__6"])
                  }
                >
                  make 6
                </button>
                <button
                  className="btn"
                  onClick={(e) =>
                    setActualUsers(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5", "__quniqueId__6", "__quniqueId__7"])
                  }
                >
                  make 7
                </button>
                <button
                  className="btn"
                  onClick={(e) =>
                    setActualUsers(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5", "__quniqueId__6", "__quniqueId__7", "__quniqueId__8"])
                  }
                >
                  make 8
                </button>

                <button className="btn" onClick={(e) => setVideo_enabled([])}>
                  connected 0
                </button>
                <button
                  className="btn"
                  onClick={(e) => setVideo_enabled(["__quniqueId__1"])}
                >
                  connected 1
                </button>
                <button
                  className="btn"
                  onClick={(e) => setVideo_enabled(["__quniqueId__1", "__quniqueId__2"])}
                >
                  connected 2
                </button>
                <button
                  className="btn"
                  onClick={(e) => setVideo_enabled(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3"])}
                >
                  connected 3
                </button>
                <button
                  className="btn"
                  onClick={(e) => setVideo_enabled(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4"])}
                >
                  connected 4
                </button>
                <button
                  className="btn"
                  onClick={(e) => setVideo_enabled(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5"])}
                >
                  connected 5
                </button>
                <button
                  className="btn"
                  onClick={(e) =>
                    setVideo_enabled(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5", "__quniqueId__6"])
                  }
                >
                  connected 6
                </button>
                <button
                  className="btn"
                  onClick={(e) =>
                    setVideo_enabled(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5", "__quniqueId__6", "__quniqueId__7"])
                  }
                >
                  connected 7
                </button>
                <button
                  className="btn"
                  onClick={(e) =>
                    setVideo_enabled(["__quniqueId__1", "__quniqueId__2", "__quniqueId__3", "__quniqueId__4", "__quniqueId__5", "__quniqueId__6", "__quniqueId__7", "__quniqueId__8"])
                  }
                >
                  connected 8
                </button>
              </div>
            )}
          </div>
        </PortfolioTestButtonSpaceStyle>
      </SmoothyVideoFrameLayout>
    </>
  );
}

export default PortFolioVideoChatContainer;
