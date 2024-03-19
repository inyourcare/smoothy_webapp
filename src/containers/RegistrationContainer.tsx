import {
  Avatar,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import { useStyles } from "../components/common/CustomStyle";
import RegistrationInputs from "../components/registration/RegistrationInputs";
import { isSignedIn } from "../lib/common/common";
import constants from "../lib/common/constants";
import logger from "../lib/custom-logger/logger";
import {
  signInSmoothyUser,
  signInWithCredential,
  signOut,
  updateProfileWhenRegistered,
  writeUsernameTransaction,
} from "../lib/firebase";
import { RootState } from "../modules";
import { SmoothyUser } from "../modules/firebase";
import { AlertSeverityProvider, CLEAR_TO_BE_USER, SET_ALERT_SNACKBAR } from "../modules/smoothy";

const RegistrationContainerStyle = styled.div`
  .registration-container-div {
    width: 80%;
    /* border: 1px solid black; */
  }
`;

function isHistoryProps(result: HistoryProps): result is HistoryProps {
  if (result && result.key && result.nickname) return true;
  else return false;
}

type HistoryProps = {
  key: string;
  nickname?: string;
  username?: string;
  credential: firebase.default.auth.AuthCredential;
  photoURL?: string;
};

function RegistrationContainer() {
  const classes = useStyles();
  const { user } = useSelector((state: RootState) => state.firebase);
  // const { toBeUser } = useSelector((state: RootState) => state.smoothy);
  const dispatch = useDispatch();
  const history = useHistory();
  const { key, nickname, credential, photoURL } = isHistoryProps(
    history.location.state as HistoryProps
  )
    ? (history.location.state as HistoryProps)
    : {
        key: "",
        nickname: "",
        credential: null as unknown as firebase.default.auth.AuthCredential,
        photoURL: "",
      };
  const [mainText1, setMainText1] = useState("환영합니다. 👋");
  const [mainText2, setMainText2] = useState(
    "스무디에서 사용할 아이디를 입력해주세요"
  );
  // const { key, nickname } = isHistoryProps(toBeUser as HistoryProps)?toBeUser as HistoryProps:{key:"",nickname:""}
  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    if (isSignedIn(user) === true) {
      // alert("이미 로그인 되어 있습니다.");
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `이미 로그인 되어 있습니다.`,
        },
      });
      goBack();
      return;
    }
    if (isHistoryProps(history.location.state as HistoryProps) === false) {
      logger("잘못된 경로", history.location.state);
      // alert("잘못된 경로로 진입하였습니다.");
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `잘못된 경로로 진입하였습니다.`,
        },
      });
      goBack();
      return;
    }
    // if (isHistoryProps(toBeUser as HistoryProps) === false) {
    //   logger('잘못된 경로' ,  toBeUser)
    //   alert("잘못된 경로로 진입하였습니다.")
    //   goBack();
    //   return
    // }
    if (nickname) {
      setMainText1(`환영해요 ${nickname}님 👋 `);
      setMainText2(`스무디에서 사용할 아이디를 입력해주세요`);
    }
  }, [dispatch, goBack, history.location.state, nickname, user]);

  const onRegister = (customPhotoURL: string|null, username: string) => {
    logger(customPhotoURL, username);
    var profileImg:string|null = null
    if (photoURL){
      profileImg = photoURL
    }
    if (customPhotoURL){
      profileImg = customPhotoURL
    }
    // username 4글자 이상 20글자 이하 /영문이나 숫자 중 1개 이상포함/ 영문대소문자,숫자,_- 만 사용
    const usernameRegx = /^(?=.*[A-Za-z0-9])[a-z0-9_-]{3,20}$/;
    if (usernameRegx.test(username)) {
      logger(username, "is valid");
      // username db 에 존재하는지 체크
      writeUsernameTransaction(username).then(function (data) {
        updateProfileWhenRegistered(
          { key, nickname, username } as SmoothyUser,
          username,
          profileImg
        )
        
          .then(function (data) {
            logger("[onRegister] profile username update & username set");
            // alert("회원가입이 완료 되었습니다. 다시 로그인 해 주세요!");
            // signOut().finally(function () {
            //   history.push("/");
            // })
            if (credential) {
              logger("[onRegister] try credential log in");
              // signInWithCredential(credential, dispatch)
              signInWithCredential(credential)
                .then(function (res) {
                  if (res === true) {
                    logger("[onRegister] register process finish successfully");
                    signInSmoothyUser(key, dispatch);
                    history.push({
                      pathname: "/",
                    });
                  } else {
                    console.error(
                      "[onRegister] signInWithCredential smoothy sign in failed::"
                    );
                    signOut().finally(function () {
                      history.push("/");
                    });
                  }
                })
                .catch(function (err) {
                  console.error(
                    "[onRegister] signInWithCredential failed::",
                    err
                  );
                });
            } else {
              console.error("[onRegister] no credential error::", {
                key,
                nickname,
                credential,
              });
            }
          })
          .catch(function (error) {
            logger("[onRegister] updateProfileWhenRegistered error", error);
          });
      });
      // getUsername(username)
      //   .then(function (data) {
      //     logger("getUsername data", data);
      //     if (!data) {
      //       // profile 에 username 업데이트
      //       // 없으면 쓰고
      //       updateProfileWhenRegistered(
      //         { key, nickname, username } as SmoothyUser,
      //         username
      //       ).then(function (data) {
      //         logger("profile username update & username set");
      //         alert("회원가입이 완료 되었습니다. 다시 로그인 해 주세요!");
      //         signOut().finally(function () {
      //           history.push("/");
      //         });
      //       });
      //       // uid username 생성
      //     } else {
      //       logger("username already exist");
      //       alert("이미 존재하는 username 입니다. 다른 이름을 입력 해 주세요");
      //     }
      //   })
      //   .catch(function (error) {
      //     logger("getUsername error", error);
      //   });
    } else {
      logger(username, "is not valid");
    }
    dispatch({ type: CLEAR_TO_BE_USER });
  };
  return (
    <>
      <RegistrationContainerStyle>
        <Grid container component="main" className={classes.registrationContainerMain}>
          <Container
            component="main"
            maxWidth="xs"
            className={classes.registrationMainContainer}
          >
            <div className={classes.nospacePaper}>
              <Avatar className={classes.bigSizeAvatar}>
                {photoURL ? (
                  <img src={photoURL} className={classes.icon} alt="profile" />
                ) : (
                  <img
                    src={constants.smoothy.images.ufo}
                    className={classes.icon}
                    alt="profile"
                  />
                )}
              </Avatar>
              <Typography
                component="h1"
                variant="h6"
                className={classes.mainText}
              >
                {/* 8명까지 함께 그룹 영상통화해요 ⚡️ 시간 제한 없이 무료로 즐기세요 */}
                {mainText1} <br />
                {mainText2}
              </Typography>
              <div className="registration-container-div">
                <RegistrationInputs onRegister={onRegister} />
              </div>
            </div>
          </Container>
        </Grid>
      </RegistrationContainerStyle>
    </>
  );
}

export default RegistrationContainer;
