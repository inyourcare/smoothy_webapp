import { Button } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import OneTermInput from "../components/common/OneTermInput";
import CreateNewChatDialog from "../components/dialogs/CreateNewChatDialog";
import LeaveRoomDialog from "../components/dialogs/LeaveRoomDialog";
import constants from "../lib/common/constants";
import { pushToTwilioVideoChatContainer } from "../lib/common/history";
import { onInsertChatlinkInput } from "../lib/common/home";
import logger from "../lib/custom-logger/logger";
import { onOffTrack, provideOwnMedia } from "../lib/twilio";
import { RootState } from "../modules";
import {
  ACTIVATE_EACH_SCREEN_HAMMER_MODE,
  AlertSeverityProvider,
  // CLEAR_ROOM_CONNECTED,
  // CLEAR_TWILIO_VIDEOCHAT_PROPS,
  DEACTIVATE_EACH_SCREEN_HAMMER_MODE,
  SET_ALERT_SNACKBAR,
} from "../modules/smoothy";
// import { preprocessToDisconnect } from "../lib/common/twilio-video-chat";
// import { defaultOnBeforeUnload } from "../lib/common/common";
import EffectButtonSpace from "../components/EffectButtonSpace";
import { useStyles } from "../components/common/CustomStyle";
import ChatroomPaticipantsDialog from "../components/dialogs/ChatroomPaticipantsDialog";
import DeviceConfigDialog from "../components/dialogs/DeviceConfigDialog";
import YoutubueView from "../components/youtube";
import { commonDisconnectARoom } from "../lib/common/chatroom-toolbar";
import { youtubeDeactivatedCallback } from "../lib/common/common";

const ChatroomToolbarStyle = styled.div`
  position: absolute;
  /* bottom: 10%; */
  width: 100%;
  height: 100%;
  /* z-index: 100; */
  .chatroom-toolbar-reaction-container {
    border-radius: 16px;
    opacity: 0.7;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .chatroom-toolbar-container {
    height: 56px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    opacity: 0.7;
    background-color: rgba(22, 22, 22, 0.6);
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    z-index: ${constants.smoothy.zidx.toolbar};
  }
  #new-chat-start-btn {
    font-weight: bold;
    /* background-color: aliceblue; */
    position: absolute;
    left: 50%;
    transform: translateX(-110%);
    bottom: 20%;
    z-index: ${constants.smoothy.zidx.btn};
    width: 20%;
  }
  #link-input-btn {
    font-weight: bold;
    /* background-color: aliceblue; */
    position: absolute;
    left: 50%;
    transform: translateX(10%);
    bottom: 20%;
    z-index: ${constants.smoothy.zidx.btn};
    width: 20%;
  }
  .display-none {
    display: none;
  }
  .toolbar-tooltip {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #c4c9d8;
    border-radius: 4px;
    min-width: 100px;
    max-width: 200px;
    white-space: nowrap;

    font-family: Roboto;
    font-size: 10px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    text-align: center;

    padding: 4px 8px;
  }
  #chatroom-toolbar-camera-off-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-camera-on-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-audio-off-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-audio-on-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-effect-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-watchParty-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-config-div:hover {
    & span {
      display: block;
    }
  }
  #chatroom-toolbar-exit-room-div:hover {
    & span {
      display: block;
    }
  }

  .opacity-disable {
    opacity: 0.5;
  }

  .btn-background-div {
    background-color: rgba(22, 22, 22, 0.6);
    width: 70px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 83px;
    color: white;
  }
  #chatroom-share-btn-div {
    position: absolute;
    top: 5%;
    right: 5%;
    z-index: ${constants.smoothy.zidx.btn};
  }
`;
type ChatroomToolbarProps = {
  setOnBeforeUnload: React.Dispatch<
    React.SetStateAction<(event: Event) => void>
  >;
};
// eslint-disable-next-line no-empty-pattern
function ChatroomToolbar({ setOnBeforeUnload }: ChatroomToolbarProps) {
  const classes = useStyles();
  const [chatlinkDialogOpen, setChatlinkDialogOpen] = useState(false);
  const [createNewChatDialogOpen, setCreateNewChatDialogOpen] = useState(false);
  const [participantsListDialogOpen, setParticipantsListDialogOpen] =
    useState(false);
  const [chatlinkInput, setChatlinkInput] = useState("");
  const {
    roomConnected,
    twilioVideoChatProps,
    eachscreen,
    youtube,
    buttonDisable,
  } = useSelector((state: RootState) => state.smoothy);
  const { video_enabled, audio_enabled, isTwilioChatroomstart } = useSelector(
    (state: RootState) => state.twilio
  );
  const { getChatlinkState, user } = useSelector(
    (state: RootState) => state.firebase
  );
  const { actualUsers } = useSelector((state: RootState) => state.twilio);
  const [chatlinkSubmitted, setChatlinkSubmitted] = useState(false); // 유저가 dialog 에서 submit 했다.
  const {
    data: chatlinkData,
    // loading: chatlinkLoading,
    // error: chatlinkError,
  } = getChatlinkState;
  // const { partyNo, sender, chatlink } =
  const { partyNo } = twilioVideoChatProps
    ? twilioVideoChatProps
    : { partyNo: null };
  // const { toBeUser } = useSelector((state: RootState) => state.smoothy);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  // leave room
  const [leaveRoomDialogOpen, setLeaveRoomDialogOpen] = useState(false);
  const [reactionListOpen, setReactionListOpen] = useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [deviceConfigDialogOpen, setDeviceConfigDialogOpen] = useState(false);
  const [isYoutubeActivated, setIsYoutubeActivated] = useState(false);
  const [isLandingEventHandled, setIsLandingEventHandled] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  // 새통화 시작
  const startNewChat = useCallback(() => {
    // alert("아직 서비스 중이 아닙니다.");
    setCreateNewChatDialogOpen(!createNewChatDialogOpen);
  }, [createNewChatDialogOpen]);

  // 통화 링크 입력
  const enterChatlink = useCallback(() => {
    setChatlinkDialogOpen(!chatlinkDialogOpen);
  }, [chatlinkDialogOpen]);

  const setVideoOff = useCallback(() => {
    onOffTrack(user?.key as string, "video", false);
  }, [user?.key]);
  const setVideoOn = useCallback(() => {
    provideOwnMedia(document.getElementById("twilio-preview")); // 카메라 리프레시 기능
    onOffTrack(user?.key as string, "video", true);
  }, [user?.key]);
  const setAudioOff = useCallback(() => {
    if (roomConnected) onOffTrack(user?.key as string, "audio", false);
  }, [user?.key, roomConnected]);
  const setAudioOn = useCallback(() => {
    if (roomConnected) onOffTrack(user?.key as string, "audio", true);
  }, [user?.key, roomConnected]);

  //
  // callback
  const disconnectARoom = useCallback(() => {
    // if (partyNo) preprocessToDisconnect(partyNo, dispatch);
    // if (roomConnected) {
    //   roomConnected.disconnect();
    //   dispatch({ type: CLEAR_TWILIO_VIDEOCHAT_PROPS });
    //   dispatch({ type: CLEAR_ROOM_CONNECTED });
    // }

    // // onBeforeUnload set
    // // disconnect 하면서 기존의 onBeforeUnload 로 바꿔줘야함
    // setOnBeforeUnload(defaultOnBeforeUnload);
    // history.push("/");
    commonDisconnectARoom({
      partyNo,
      roomConnected,
      setOnBeforeUnload,
      history,
    });
  }, [history, partyNo, roomConnected, setOnBeforeUnload]);

  const exitChatRoom = useCallback(() => {
    if (roomConnected && partyNo) setLeaveRoomDialogOpen(true);
    // else alert("통화중이 아닙니다.");
    else
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `통화중이 아닙니다.`,
        },
      });
  }, [dispatch, partyNo, roomConnected]);

  const openReactionList = useCallback(() => {
    if (roomConnected && partyNo) {
      setReactionListOpen(!reactionListOpen);
      // } else alert("통화중이 아닙니다.");
    } else
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `통화중이 아닙니다.`,
        },
      });
  }, [dispatch, partyNo, reactionListOpen, roomConnected]);

  const fullscreenHammerEffectOnClick = useCallback(() => {
    if (eachscreen.hammer === true)
      dispatch({ type: DEACTIVATE_EACH_SCREEN_HAMMER_MODE });
    else dispatch({ type: ACTIVATE_EACH_SCREEN_HAMMER_MODE });
  }, [dispatch, eachscreen.hammer]);

  const toggleYoutubeMode = useCallback(() => {
    if (roomConnected && partyNo) {
      setYoutubeDialogOpen(!youtubeDialogOpen);
      // if (youtubeMode === true) {
      //   logger("EffectButtonSpace deactivate");
      //   dispatch({ type: DEACTIVATE_YOUTUBE, payload: partyNo });
      //   setYoutubeDialogOpen(false);
      // } else {
      //   dispatch({ type: ACTIVATE_YOUTUBE });
      //   setYoutubeDialogOpen(true);
      // }
      // } else alert("통화중이 아닙니다.");
    }
    dispatch({
      type: SET_ALERT_SNACKBAR,
      payload: {
        severity: AlertSeverityProvider.error,
        alertMessage: `통화중이 아닙니다.`,
      },
    });
  }, [dispatch, partyNo, roomConnected, youtubeDialogOpen]);

  // const youtubeDeactivatedCallback = useCallback(() => {
  //   // todo:: 유튜브가 종료되는 경우 처리
  //   // function* deactivateYoutubeSaga(action:ReturnType<typeof deactivateYoutubeAction>){
  //   //   if(action && action.payload){
  //   //     yield call(removePlayback , action.payload)
  //   //     yield call(removeItemsFromPlayList , action.payload)
  //   //   }
  //   // }
  //   if (partyNo) {
  //     removePlayback(partyNo);
  //     removeItemsFromPlayList(partyNo);
  //     dispatch({ type: CLEAR_SELECTED_VIDEO });
  //   }
  // }, [dispatch, partyNo]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const youtubeDeactivatedDetectEffect = useEffect(() => {
    if (roomConnected && partyNo) {
      if (!youtube.sharedVideoPlayback) {
        if (isYoutubeActivated) {
          // alert("youtube mode 종료");
          youtubeDeactivatedCallback(partyNo);
        }
        setIsYoutubeActivated(false);
      } else {
        if (!isYoutubeActivated) {
          // alert("youtube mode 시작");
        }
        setIsYoutubeActivated(true);
      }
    }
  }, [isYoutubeActivated, partyNo, roomConnected, youtube.sharedVideoPlayback]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mediaOnOffDetectEffect = useEffect(() => {
    // if (roomConnected) {
    // } else {
    logger('mediaOnOffDetectEffect', video_enabled,audio_enabled,user,user?.key)
    if (video_enabled.filter((uid) => uid === user?.key).length > 0) {
      setIsCameraOn(true);
    } else {
      setIsCameraOn(false);
    }
    if (audio_enabled.filter((uid) => uid === user?.key).length > 0) {
      setIsAudioOn(true);
    } else {
      setIsAudioOn(false);
    }
    // }
  }, [audio_enabled, roomConnected, user, video_enabled]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const startVideoChatEffect = useEffect(() => {
    logger('startVideoChatEffect',isLandingEventHandled,chatlinkData,chatlinkInput,chatlinkSubmitted)
    if (
      (isLandingEventHandled === false &&
        chatlinkData?.partyNo &&
        chatlinkData.sender) ||
      (chatlinkData?.partyNo &&
        chatlinkData.sender &&
        chatlinkInput &&
        chatlinkSubmitted)
    ) {
      // getOpenChat(chatlinkData, history, dispatch, chatlink);
      pushToTwilioVideoChatContainer({
        chatlinkData,
        chatlink: chatlinkInput
          ? chatlinkInput
          : (chatlinkData.openChatLink as string),
        history,
        from: constants.videoChat.from.openchat,
      });
      // 챗링크 입력 => sender가 친구가 아니면 친구 만듦 =>
      // if (friends.get(chatlinkData.sender)) {
      //   // dispatch({type:SET_TWILIO_VIDEOCHAT_PROPS,payload:{...chatlinkData, chatlink}})
      //   // history.push({
      //   //   pathname: "/videochat",
      //   //   // search:"?test=abc",
      //   //   // state: { ...chatlinkData, chatlink },
      //   // });
      //   // pushToTwilioVideoChatContainer({
      //   //   chatlinkData,
      //   //   chatlink: chatlinkInput
      //   //     ? chatlinkInput
      //   //     : (chatlinkData.openChatLink as string),
      //   //   history,
      //   //   from: constants.videoChat.from.openchat,
      //   // });
      // } else {
      //   beFriendEachotherWithOpenchatlink(
      //     getCurrentUser()?.uid as string,
      //     chatlinkInput
      //   )
      //     .then(function (result) {
      //       logger("beFriendEachotherWithOpenchatlink in use effect");
      //       if (
      //         result.successList.filter((uid) => uid === chatlinkData.sender)
      //           .length > 0
      //       ) {
      //         logger("beFriendEachotherWithOpenchatlink result->", result);
      //         // dispatch({type:SET_TWILIO_VIDEOCHAT_PROPS,payload:{...chatlinkData, chatlink}})
      //         // history.push({
      //         //   pathname: "/videochat",
      //         //   // search:"?test=abc",
      //         //   // state: { ...chatlinkData, chatlink },
      //         // });

      //         return;
      //       } else {
      //         throw Error("friend each other fail");
      //       }
      //     })
      //     .catch(function (error) {
      //       console.error(error);
      //       errorLogger({
      //         id: `be friend each outher err`,
      //         msg: `친구 추가 중 알 수 없는 에러가 발생했습니다.`,
      //         error,
      //       });
      //     });
      // }
      setChatlinkInput("");
      setChatlinkSubmitted(false);
    }
    setIsLandingEventHandled(true);
  }, [
    chatlinkInput,
    chatlinkData,
    chatlinkSubmitted,
    history,
    isLandingEventHandled,
  ]);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const guideToRegistEffect = useEffect(() => {
  //   if (!user && toBeUser && toBeUser.loading === false) {
  //     history.push({
  //       pathname: "/registration",
  //       state: { ...toBeUser },
  //     });
  //     dispatch({ type: CLEAR_TO_BE_USER });
  //   }
  // }, [dispatch, history, toBeUser, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const effectChangeWhenNotChatEffect = useEffect(() => {
    if (!roomConnected) {
      setReactionListOpen(false);
      document
        .getElementById("chatroom-toolbar-effect-div")
        ?.classList.add("opacity-disable");
      document
        .getElementById("chatroom-toolbar-audio-off-div")
        ?.classList.add("opacity-disable");
      document
        .getElementById("chatroom-toolbar-audio-on-div")
        ?.classList.add("opacity-disable");
    } else {
      document
        .getElementById("chatroom-toolbar-effect-div")
        ?.classList.remove("opacity-disable");
      document
        .getElementById("chatroom-toolbar-audio-off-div")
        ?.classList.remove("opacity-disable");
      document
        .getElementById("chatroom-toolbar-audio-on-div")
        ?.classList.remove("opacity-disable");
    }
  }, [setReactionListOpen, roomConnected]);

  return (
    <ChatroomToolbarStyle>
      {partyNo && (
        <YoutubueView
          partyId={partyNo}
          open={youtubeDialogOpen}
          setOpen={setYoutubeDialogOpen}
        />
      )}
      {roomConnected ? (
        <>
          <div id="chatroom-share-btn-div">
            {/* <Button disabled={buttonDisable}> */}
            <Button
              onClick={() =>
                setParticipantsListDialogOpen(!participantsListDialogOpen)
              }
            >
              <div className="btn-background-div">
                {/* <span>워치파티</span> */}
                <img
                  src={constants.smoothy.images.toolbar.memberCount}
                  alt="member count"
                />
                <span>{actualUsers.length}</span>
              </div>
            </Button>
            <Button
              onClick={() =>
                setCreateNewChatDialogOpen(!createNewChatDialogOpen)
              }
            >
              <div className="btn-background-div">
                <img
                  src={constants.smoothy.images.toolbar.shareChatlink}
                  alt="share chatlink"
                />
              </div>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <OneTermInput
              onInsert={(chatlink: string) => {
                setChatlinkInput(onInsertChatlinkInput(chatlink));
              }}
              btnString="통화 연결 요청"
              disabled={buttonDisable || roomConnected ? true : false}
              open={chatlinkDialogOpen}
              setOpen={setChatlinkDialogOpen}
              dialogMode={true}
              setChatlinkSubmitted={setChatlinkSubmitted}
            />
          </div>
          {!isTwilioChatroomstart && (
            <div className="home-btn-div">
              <Button
                disabled={buttonDisable || roomConnected ? true : false}
                variant="contained"
                id="new-chat-start-btn"
                onClick={startNewChat}
                className={`${classes.root}`}
              >
                새통화 시작
              </Button>
              <Button
                disabled={buttonDisable || roomConnected ? true : false}
                variant="contained"
                id="link-input-btn"
                onClick={enterChatlink}
                className={`${classes.root}`}
              >
                통화링크 입력
              </Button>
            </div>
          )}
        </>
      )}
      <div className="chatroom-toolbar-container">
        <Button disabled={buttonDisable}>
          {!isCameraOn ? (
            <div id="chatroom-toolbar-camera-on-div">
              <span className="toolbar-tooltip display-none">카메라 켜기</span>
              <img
                src={constants.smoothy.images.toolbar.cameraOff}
                // src={constants.smoothy.images.toolbar.cameraOn}
                // className="ic_chatroom_toolbar_camera_on"
                alt="camera"
                onClick={setVideoOn}
                id="chatroom-toolbar-camera-on-img"
              />
            </div>
          ) : (
            <div id="chatroom-toolbar-camera-off-div">
              <span className="toolbar-tooltip display-none">카메라 끄기</span>
              <img
                // src={constants.smoothy.images.toolbar.cameraOff}
                src={constants.smoothy.images.toolbar.cameraOn}
                // className="ic_chatroom_toolbar_camera_on"
                alt="camera"
                onClick={setVideoOff}
                id="chatroom-toolbar-camera-off-img"
              />
            </div>
          )}
        </Button>
        <Button disabled={buttonDisable}>
          {!isAudioOn ? (
            <div id="chatroom-toolbar-audio-on-div">
              <span className="toolbar-tooltip display-none">마이크 켜기</span>
              <img
                // src={constants.smoothy.images.toolbar.micOn}
                src={constants.smoothy.images.toolbar.micOff}
                // className="ic_chatroom_toolbar_camera_on"
                alt="mic"
                onClick={setAudioOn}
                id="chatroom-toolbar-audio-on-img"
              />
            </div>
          ) : (
            <div id="chatroom-toolbar-audio-off-div">
              <span className="toolbar-tooltip display-none">마이크 끄기</span>
              <img
                // src={constants.smoothy.images.toolbar.micOff}
                src={constants.smoothy.images.toolbar.micOn}
                // className="ic_chatroom_toolbar_camera_on"
                alt="mic"
                onClick={setAudioOff}
                id="chatroom-toolbar-audio-off-img"
              />
            </div>
          )}
        </Button>
        {partyNo && reactionListOpen ? (
          <EffectButtonSpace
            partyId={partyNo}
            fullscreenHammerEffectOnClick={fullscreenHammerEffectOnClick}
            // youtubeMode={youtubeMode}
            hammerMode={eachscreen.hammer}
            setClose={setReactionListOpen}
          />
        ) : (
          <></>
        )}
        <Button disabled={buttonDisable}>
          <div id="chatroom-toolbar-effect-div">
            <span className="toolbar-tooltip display-none">리액션 선택</span>
            {reactionListOpen ? (
              <img
                src={constants.smoothy.images.toolbar.effectSelected}
                // className="ic_chatroom_toolbar_camera_on"
                alt="effect"
                id="chatroom-toolbar-effect-img"
                onClick={openReactionList}
              />
            ) : (
              <img
                src={constants.smoothy.images.toolbar.effect}
                // className="ic_chatroom_toolbar_camera_on"
                alt="effect"
                id="chatroom-toolbar-effect-img"
                onClick={openReactionList}
              />
            )}
          </div>
        </Button>
        <Button disabled={buttonDisable}>
          <div id="chatroom-toolbar-watchParty-div">
            <span className="toolbar-tooltip display-none">워치파티</span>
            <img
              src={constants.smoothy.images.toolbar.watchParty}
              // className="ic_chatroom_toolbar_camera_on"
              alt="watch party"
              id="chatroom-toolbar-watchParty-img"
              onClick={() => toggleYoutubeMode()}
            />
          </div>
        </Button>
        <Button disabled={buttonDisable}>
          <div id="chatroom-toolbar-config-div">
            <span className="toolbar-tooltip display-none">
              카메라, 마이크 기기 설정
            </span>
            <img
              src={constants.smoothy.images.toolbar.config}
              // className="ic_chatroom_toolbar_camera_on"
              alt="watch party config"
              id="chatroom-toolbar-config-img"
              onClick={() => {
                // alert("현재는 지원하지 않는 기능입니다.");
                dispatch({
                  type: SET_ALERT_SNACKBAR,
                  payload: {
                    severity: AlertSeverityProvider.error,
                    alertMessage: `현재는 지원하지 않는 기능입니다.`,
                  },
                });
              }} //setDeviceConfigDialogOpen(!deviceConfigDialogOpen)}}
            />
          </div>
        </Button>
        <Button disabled={buttonDisable}>
          <div id="chatroom-toolbar-exit-room-div">
            <span className="toolbar-tooltip display-none">방 나가기</span>
            <img
              src={constants.smoothy.images.toolbar.exitRoom}
              // className="ic_chatroom_toolbar_camera_on"
              alt="exit room"
              id="chatroom-toolbar-exit-room-img"
              onClick={exitChatRoom}
            />
          </div>
        </Button>
        <div>
          <LeaveRoomDialog
            leaveRoom={disconnectARoom}
            open={leaveRoomDialogOpen}
            setOpen={setLeaveRoomDialogOpen}
          />
        </div>
        <div>
          <CreateNewChatDialog
            open={createNewChatDialogOpen}
            setOpen={setCreateNewChatDialogOpen}
          />
        </div>
        <div>
          <ChatroomPaticipantsDialog
            open={participantsListDialogOpen}
            setOpen={setParticipantsListDialogOpen}
          />
        </div>
        <div>
          <DeviceConfigDialog
            open={deviceConfigDialogOpen}
            setOpen={setDeviceConfigDialogOpen}
          />
        </div>
      </div>
    </ChatroomToolbarStyle>
  );
}

export default ChatroomToolbar;
