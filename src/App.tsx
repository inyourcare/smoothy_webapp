import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";
import AppDrawer from "./components/AppDrawer";
import Test from "./components/test";
import ChatroomToolbar from "./containers/ChatroomToolbarContainer";
import ErrorPageContainer from "./containers/ErrorPageContainer";
// import SignIn from './components/SignIn';
import { CircularProgress } from "@material-ui/core";
import { WhiteTextTypography } from "./components/common/CustomComponents";
import AlertSnackbar from "./components/snackbar/AlertSnackbar";
import HomeContainer from "./containers/HomeContainer";
import PortFolioVideoChatContainer from "./containers/PortFolioVideoChatContainer";
import RedirectedContainer from "./containers/RedirectedContainer";
import RegistrationContainer from "./containers/RegistrationContainer";
import { commonDisconnectARoom } from "./lib/common/chatroom-toolbar";
import { defaultOnBeforeUnload } from "./lib/common/common";
import constants from "./lib/common/constants";
import {
  pushToHomeErrorPageContainer,
  pushToTwilioVideoChatContainer,
} from "./lib/common/history";
import logger from "./lib/custom-logger/logger";
import {
  GetChatLinkResult,
  activateMessaging,
  getFriends,
  getMyFriendList,
  getSenderCurrentParty,
  onAuthStateChanged,
  signOut,
  subscribeMyProfile,
  unsbscribeAuthChange,
  unsbscribeMyProfile,
  updateFirestoreWhenNotificationPermitted,
} from "./lib/firebase";
import { RootState } from "./modules";
import { SET_FRIENDS, SmoothyUser } from "./modules/firebase";
import {
  AlertSeverityProvider,
  CLEAR_TO_BE_USER,
  SET_ALERT_SNACKBAR,
} from "./modules/smoothy";

const AppStyle = styled.div`
  #app-bloking-div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.7;
    z-index: ${constants.smoothy.zidx.blocking};
    pointer-events: none;
    /* border: 5px solid gray;
    box-sizing: border-box; */
  }
  #app-bloking-div div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    /* background-color: white; */
  }

  .display-out {
    display: none;
  }
`;

function App() {
  const { user, friends } = useSelector((state: RootState) => state.firebase);
  const {
    fcmMessage,
    roomConnected,
    toBeUser,
    twilioVideoChatProps,
    buttonDisable,
    alertSnackbar,
  } = useSelector((state: RootState) => state.smoothy);
  const { partyNo } = twilioVideoChatProps
    ? twilioVideoChatProps
    : { partyNo: null };
  const { testMode } = useSelector((state: RootState) => state.test);
  const dispatch = useDispatch();
  const [syncronized, setSyncronized] = useState(false);
  const history = useHistory();
  const [isNotiPermissionChecked, setIsNotiPermissionChecked] = useState(false);
  const [alertSnackbarOpen, setAlertSnackbarOpen] = useState(false);
  // const [currentProfile, setCurrentProfile] = useState(
  //   null as unknown as FirestoreProfile
  // );
  const [prevUser, setPrevUser] = useState(
    null as unknown as SmoothyUser | null
  );
  // const callback = (event: Event) => {
  //   logger('[App] commonClose')
  //   commonClose(dispatch, event);
  // }
  // const [onBeforeUnload, setOnBeforeUnload] = useState(()=> (event: Event) => {
  //   logger("[App] commonClose");
  //   commonClose(dispatch,event);
  // });
  const [onBeforeUnload, setOnBeforeUnload] = useState(defaultOnBeforeUnload);

  // 브라우저 종료 등에 대한 동작
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const beforeUnloadEffect = useEffect(() => {
    window.onbeforeunload = onBeforeUnload;
  }, [onBeforeUnload]);

  // default effect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    if (user) {
      // getProgfile(user.key)
      //   .then((profile) => {
      //     logger("[defaultEffect] set Profile::", profile);
      //     setCurrentProfile(profile);
      //   })
      //   .catch((error) => {
      //     //todo:: 에러있으면 나중에 다시 또 이걸 해야할듯
      //     console.error("[defaultEffect]", error);
      //   });
      subscribeMyProfile();
    }
    return () => unsbscribeMyProfile();
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const subscribeFriendsEffect = useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscribeFriendsInterval = setInterval(function () {
      const friends = getFriends();
      if (friends) dispatch({ type: SET_FRIENDS, payload: friends });
    }, 3000);
    // return clearInterval(subscribeFriendsInterval);
  }, [dispatch]);

  // Auth check
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authCheckEffect = useEffect(() => {
    // if (isSignedIn(user) === true) {
    //   unsbscribeAuthChange();
    // } else {
    //   onAuthStateChanged(dispatch);
    // }
    onAuthStateChanged(dispatch);
    return () => {
      unsbscribeAuthChange();
    };
  }, [dispatch, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const syncFriensEffect = useEffect(() => {
    logger("useEffect", syncronized, user);
    if (syncronized === false && user) {
      logger("syncronizing");
      getMyFriendList().then(function (result) {
        const eachFriendCount = result.docs.filter(
          (doc) => doc.data().status === 41
        ).length;
        const landedFriendCount = Array.from(friends.values()).filter(
          (friend) => friend.status === 41
        ).length;
        logger(eachFriendCount, landedFriendCount);
        if (eachFriendCount === landedFriendCount) {
          setSyncronized(true);
        }
      });
    }
    if (!user) {
      setSyncronized(false);
    }
  }, [friends, friends.size, syncronized, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fcmMeesageEffect = useEffect(() => {
    while (fcmMessage.length > 0) {
      const message = fcmMessage.shift();
      if (message) {
        switch (message.arg_notification_type) {
          case constants.smoothy.notification.type.forceJoin:
          case constants.smoothy.notification.type.ping:
            if (!roomConnected) {
              if (
                message.arg_party_no &&
                message.arg_party_no ===
                  constants.smoothy.notification.party.current
              ) {
                logger("current called");
                getSenderCurrentParty(message.arg_sender_key)
                  .then((party) => {
                    logger("profile's party", party);
                    if (party) {
                      // todo:: current 로 오는 경우를 몰라서 테스트안해봄
                      const partyNo = party;
                      const sender = message.arg_sender_key;
                      pushToTwilioVideoChatContainer({
                        chatlinkData: { partyNo, sender } as GetChatLinkResult,
                        chatlink: null as unknown as string,
                        history,
                        from: constants.videoChat.from.openchat,
                      });
                    }
                  })
                  .catch((e) => {
                    logger("error when getSenderCurrentParty.then()", e);
                  });
              } else {
                const partyNo = message.arg_party_no;
                const sender = message.arg_sender_key;
                pushToTwilioVideoChatContainer({
                  chatlinkData: { partyNo, sender } as GetChatLinkResult,
                  chatlink: null as unknown as string,
                  history,
                  from: constants.videoChat.from.openchat,
                });
              }
            } else {
              // alert(message.arg_sender_name + "님이 불러요!");
              dispatch({
                type: SET_ALERT_SNACKBAR,
                payload: {
                  severity: AlertSeverityProvider.info,
                  alertMessage: `${message.arg_sender_name} + "님이 불러요!"`,
                },
              });
            }
            break;
          default:
            logger("unhandled type", message);
            break;
        }
      }
    }
  }, [dispatch, fcmMessage, history, roomConnected]);

  // notification permission
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notiPermissionEffct = useEffect(() => {
    const activatveMessagingCommon = () =>
      activateMessaging()
        .then(function (currentToken) {
          // createUserDevice(currentToken as string);
          if (user && currentToken)
            updateFirestoreWhenNotificationPermitted(user, currentToken);
        })
        .catch(function (err) {
          console.error("[notiPermissionEffct] activatingMessage failed", err);
        });
    if (user && !isNotiPermissionChecked) {
      if (Notification.permission !== "granted") {
        logger("[notiPermissionEffct] request permission");
        Notification.requestPermission().then(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            logger(
              "[notiPermissionEffct] denied notification permission changed to granted",
              Notification.permission
            );

            // return activateMessaging()
            //   .then(function (currentToken) {
            //     createUserDevice(currentToken as string);
            //   })
            //   .catch(function (err) {
            //     console.error(
            //       "[notiPermissionEffct] activatingMessage failed",
            //       err
            //     );
            //   });
            return activatveMessagingCommon();
          }
        });
      } else {
        logger(
          "[notiPermissionEffct] permission granted and activating messaging"
        );
        // activateMessaging()
        //   .then(function (currentToken) {
        //     createUserDevice(currentToken as string);
        //   })
        //   .catch(function (err) {
        //     console.error(
        //       "[notiPermissionEffct] activatingMessage failed",
        //       err
        //     );
        //   });
        activatveMessagingCommon();
      }
      setIsNotiPermissionChecked(true);
    } else if (!user && isNotiPermissionChecked) {
      setIsNotiPermissionChecked(false);
    }
  }, [isNotiPermissionChecked, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const browserCheck = useEffect(() => {
    const agt = navigator.userAgent.toLowerCase();
    // if (agt.indexOf("chrome") !== -1) return 'Chrome';
    if (agt.indexOf("chrome") === -1) {
      // 크롬이 아니면
      console.warn("not chrome");
      // alert("chrome 이 아닙니다.");
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `chrome 이 아닙니다.`,
        },
      });
      pushToHomeErrorPageContainer(history, { code: "", msg: "" });
    }
    // if (agt.indexOf("opera") !== -1) return 'Opera';
    // if (agt.indexOf("staroffice") !== -1) return 'Star Office';
    // if (agt.indexOf("webtv") !== -1) return 'WebTV';
    // if (agt.indexOf("beonex") !== -1) return 'Beonex';
    // if (agt.indexOf("chimera") !== -1) return 'Chimera';
    // if (agt.indexOf("netpositive") !== -1) return 'NetPositive';
    // if (agt.indexOf("phoenix") !== -1) return 'Phoenix';
    // if (agt.indexOf("firefox") !== -1) return 'Firefox';
    // if (agt.indexOf("safari") !== -1) return 'Safari';
    // if (agt.indexOf("skipstone") !== -1) return 'SkipStone';
    // if (agt.indexOf("netscape") !== -1) return 'Netscape';
    // if (agt.indexOf("mozilla/5.0") !== -1) return 'Mozilla';
    // if (agt.indexOf("msie") !== -1) {
    //     let rv = -1;
    //   if (navigator.appName == 'Microsoft Internet Explorer') {
    //     let ua = navigator.userAgent; var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    //   if (re.exec(ua) != null)
    //     rv = parseFloat(RegExp.$1);
    //   }
    //   return 'Internet Explorer '+rv;
    // }
  }, [dispatch, history]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const guideToRegistEffect = useEffect(() => {
    if (!user && toBeUser && toBeUser.loading === false) {
      history.push({
        pathname: "/registration",
        state: { ...toBeUser },
      });
      dispatch({ type: CLEAR_TO_BE_USER });
    }
  }, [dispatch, history, toBeUser, user]);

  //
  // default window close
  // window.onbeforeunload = (event: Event) => {
  //   logger('[App] commonClose')
  //   commonClose(dispatch, event);
  // };

  // 로그아웃을 관장,
  // dispatch 로 관리하면 sign out 했을 때 처리해야하는 것들 다
  // 처리되는지 여부와 상관없이 sign out 시점이 만들어질 수 있어 이곳에서 처리함
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const leaveTheRoomWhenSignOut = useEffect(() => {
    logger("[leaveTheRoomWhenSignOut] userstate", user, prevUser);
    if (!user) {
      if (prevUser) {
        commonDisconnectARoom({
          partyNo,
          roomConnected,
          setOnBeforeUnload,
          history,
        });
        setTimeout(() => signOut(), 3000);
      }
      setPrevUser(null);
    } else {
      setPrevUser(user);
    }
  }, [history, partyNo, prevUser, roomConnected, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const snackbarEffect = useEffect(() => {
    if (alertSnackbar?.alertMessage && alertSnackbar.severity) {
      setAlertSnackbarOpen(true);
    }
  }, [alertSnackbar?.alertMessage, alertSnackbar?.severity]);
  return (
    <>
      <AppStyle>
        <div
          id="app-bloking-div"
          className={buttonDisable === true ? "" : "display-out"}
        >
          <div>
            <WhiteTextTypography variant="h1">
              {/* {"로딩중..."} */}
              <CircularProgress size={300} thickness={3.6} />
            </WhiteTextTypography>
          </div>
        </div>
        {/* <BrowserRouter> */}
        {process.env.REACT_APP_MODE === "development" ? (
          <>
            <Link
              to="/"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: constants.smoothy.zidx.btn,
              }}
            >
              Home{" "}
            </Link>
            <Link
              to="/test"
              style={{
                position: "absolute",
                top: 0,
                right: 50,
                zIndex: constants.smoothy.zidx.btn,
              }}
            >
              Test
            </Link>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 100,
                zIndex: constants.smoothy.zidx.btn,
              }}
            >
              {syncronized === true ? "true" : "false"}
            </div>
            <Link
              to="/registration"
              style={{
                position: "absolute",
                top: 0,
                right: 150,
                zIndex: constants.smoothy.zidx.btn,
              }}
            >
              회원가입
            </Link>
            <Link
              to="/videochat"
              style={{
                position: "absolute",
                top: 0,
                right: 230,
                zIndex: constants.smoothy.zidx.btn,
              }}
            >
              videochat
            </Link>
          </>
        ) : null}
        {user && syncronized && !testMode ? (
        // {true ? (
          <>
            {/* <AppDrawer profile={currentProfile} /> */}
            <AppDrawer />
            {/* <div
              className="sign-in-user-info-div"
              style={{
                position: "absolute",
                top: "5%",
                zIndex: 10,
                border: "1px solid #ffa200",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <th>key:</th>
                    <td>{user.key}</td>
                  </tr>
                  <tr>
                    <th>nickname:</th>
                    <td>{user.nickname}</td>
                  </tr>
                  <tr>
                    <th>username:</th>
                    <td>{user.username}</td>
                  </tr>
                </tbody>
              </table>
            </div> */}
            <ChatroomToolbar setOnBeforeUnload={setOnBeforeUnload} />
          </>
        ) : (
          <div></div>
        )}
        <Switch>
          <Route
            exact
            path="/"
            render={() => <HomeContainer syncronized={syncronized} />}
          />
          {/* <Route exact path="/videochat" component={TwilioVideoChatContainer} /> */}
          <Route
            exact
            path="/videochat"
            render={() => (
              // <TwilioVideoChatContainer setOnBeforeUnload={setOnBeforeUnload} />
              <PortFolioVideoChatContainer
                setOnBeforeUnload={setOnBeforeUnload}
              />
            )}
          />
          <Route exact path="/registration" component={RegistrationContainer} />
          <Route exact path="/test" component={Test} />
          <Route path="/redirected" component={RedirectedContainer} />
          <Route path="/" component={ErrorPageContainer} />
        </Switch>
        <AlertSnackbar
          open={alertSnackbarOpen}
          setOpen={setAlertSnackbarOpen}
          severity={alertSnackbar?.severity}
          alertMessage={alertSnackbar?.alertMessage}
        />
        {/* </BrowserRouter> */}
      </AppStyle>
    </>
  );
}

export default App;
