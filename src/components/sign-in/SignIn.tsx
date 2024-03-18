import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import React, { useEffect, useState } from "react";
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import constants from "../../lib/common/constants";
import { fromNow } from "../../lib/util/timeUtils";
import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";
import SignInButtons from "./SignInButtons";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"*카카오 애플 로그인은 오픈 중비중입니다."}
      <br />
      {"가입 및 로그인하면 "}
      <Link color="textPrimary" href="https://smoothy.co/eula/smoothy" underline="always" target='_blank'>
        이용약관
      </Link>
      {"과 "}
      <Link color="textPrimary" href="https://smoothy.co/privacy/smoothy" underline="always" target='_blank'>
        개인정보처리방침
      </Link>
      {"에 동의하게 됩니다."}
      <br />
      {"Copyright © "}
      <Link color="inherit" href="https://smoothy.co/" target='_blank'>
        Smoothy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// type SigninProfileInfoProps = {
//   signInWithPopup: (providerName: string) => void;
//   goToRegistration: () => void;
// };

export default function SignIn() {
  //
  // definitions
  const { getChatlinkState } = useSelector(
    (state: RootState) => state.firebase
  );
  const {
    data: chatlinkData,
    loading: chatlinkLoading,
    // error: chatlinkError,
  } = getChatlinkState;
  const classes = useStyles();
  const [checkedRememberId, setCheckedRememberId] = useState(
    localStorage.getItem(constants.smoothy.auth.rememberMe) === "true"
      ? true
      : false
  );
  const [mainText, setMainText] = useState(
    // "8명까지 함께 그룹 영상통화해요 ⚡️ 시간 제한 없이 무료로 즐기세요"
    "그룹영상통화 스무디"
  );
  const [subText] = useState("8명까지 시간제한없이 무료로! 지금 바로 웹에서 만나보세요");

  // {} 님이 {} 에 시작한 대화방입니다.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const guideTextEffect = useEffect(() => {
    if (chatlinkData && chatlinkData.nickname) {
      // login 없이 조회하면 permission 에러
      // getProgfile(chatlinkData.sender)
      // .then(function (profile){
      //   setMainText(`${profile?.nickname} 님이 ${chatlinkData.timestamp}에 시작한 대화방입니다.`)
      // })
      setMainText(
        `${chatlinkData.nickname} 님이 
        ${fromNow(
          Number(chatlinkData.timestamp)
        )} 에 시작한 대화방입니다.`
      );
    }
  }, [chatlinkData, chatlinkData?.sender]);

  function checkboxOnChange(
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    localStorage.setItem(constants.smoothy.auth.rememberMe, String(checked));
    setCheckedRememberId(checked);
  }
  return (
    <Grid container component="main" className={classes.signInMain}>
      <Grid item xs={false} sm={4} md={7} className={classes.sideImage} />
      <Grid item xs={12} sm={8} md={5} className={classes.signInMainContainer}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.nospacePaper}>
            <Avatar className={classes.bigSizeAvatar}>
              {chatlinkLoading === true ? (
                "로딩중"
              ) : chatlinkData && chatlinkData.photoUriString? (
                <img
                  src={chatlinkData.photoUriString}
                  className={classes.icon}
                  alt="logo"
                />
              ) : (
                <img
                  src={constants.smoothy.images.ufo}
                  // src={"https://firebasestorage.googleapis.com/v0/b/smoothy-84e22.appspot.com/o/web%2Fweb_main_smoothyprofile%402x.png?alt=media&token=ef7de4c6-d4f2-4921-b492-e65040db1f7b"}
                  className={classes.icon}
                  alt="logo"
                />
              )}
            </Avatar>
            <Typography
              component="h1"
              variant="h6"
              className={classes.mainText}
            >
              {/* 8명까지 함께 그룹 영상통화해요 ⚡️ 시간 제한 없이 무료로 즐기세요 */}
              {mainText}
            </Typography>
            <Typography
              component="h3"
              variant="caption"
              className={classes.mainText}
            >
              {subText}
            </Typography>
            <div className={classes.form}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedRememberId}
                    id="remember-me-checkbox"
                    value="remember"
                    color="primary"
                    onChange={(e, checked) => checkboxOnChange(e, checked)}
                  />
                }
                label="Remember me"
              />
              <SignInButtons />
              {/* <Button
                // type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.signInBtn}
                onClick={() => goToRegistration()}
              >
                가입하기
              </Button> */}
            </div>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
