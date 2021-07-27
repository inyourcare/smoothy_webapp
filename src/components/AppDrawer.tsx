import {
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
// import MenuOpenIcon from "@material-ui/icons/MenuOpen";
// import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { resign } from "../lib/firebase";
import constants from "../lib/common/constants";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_OUT } from "../modules/firebase";
import { RootState } from "../modules";
import logger from "../lib/custom-logger/logger";
import ChangeProfileImgDialog from "./dialogs/ChangeProfileImgDialog";
import ChangeNicknameDialog from "./dialogs/ChangeUserNameDialog";
import { AlertSeverityProvider, SET_ALERT_SNACKBAR } from "../modules/smoothy";
import { useStyles } from "./common/CustomStyle";

const AppDrawerStyle = styled.div`
  .avatar {
    /* width: 50%;
    height: 50%; */
    width: 200px;
    height: 200px;
  }
  .avatar-img {
    object-fit: fill;
    /* width: "100%";
    height: "100%"; */
    width: 200px;
    height: 200px;
  }
  .margin-top {
    margin-top: 5%;
  }
  #drawer-profile-div {
    height: 10%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
`;
type AppDrawerProps = {
  // anchor: "left" | "top" | "right" | "bottom" | undefined;
  // setDrawerOpen: (open: boolean) => void;
  // drawerOpen: boolean;
  // profile: FirestoreProfile;
};
// function AppDrawer({ profile }: AppDrawerProps) {
// eslint-disable-next-line no-empty-pattern
function AppDrawer({}: AppDrawerProps) {
  const anchor = "left";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [changeProfileImgDialogOpen, setChangeProfileImgDialogOpen] =
    useState(false);
  const [changeUserNameDialogOpen, setChangeUserNameDialogOpen] =
    useState(false);
  const classes = useStyles();

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.firebase);
  const { buttonDisable, myProfile } = useSelector(
    (state: RootState) => state.smoothy
  );
  const { firebaseProfile } = useSelector(
    (state: RootState) => state.firebase
  );
  // const onClickFuntions = {
  //   로그아웃: () => {
  //     if (user) dispatch({ type: SIGN_OUT, payload: user.key });
  //   },
  //   탈퇴: () => {
  //     resign({}).then((res) => {
  //       if (res && res.success === true) {
  //         logger("탈퇴성공");
  //         dispatch({ type: SIGN_OUT });
  //       } else {
  //         console.error("탈퇴실패", res);
  //         // alert(
  //         //   "탈퇴로직 실행 중 error 가 있었습니다. 잠시 기다린 후 다시 시도 해 주세요"
  //         // );
  //         dispatch({
  //           type: SET_ALERT_SNACKBAR,
  //           payload: {
  //             severity: AlertSeverityProvider.error,
  //             alertMessage: `탈퇴로직 실행 중 error 가 있었습니다. 잠시 기다린 후 다시 시도 해 주세요`,
  //           },
  //         });
  //         dispatch({ type: SIGN_OUT });
  //       }
  //     });
  //   },
  // };
  const [drawerFuntionNames] = useState({
    myId: "내 아이디",
    changeUserName: "닉네임 변경",
    googleLogin: "구글 로그인",
    version: "버전",
    faq: "FAQ",
    termsOfService: "이용약관",
    privacyPolicy: "개인 정보 처리 방침",
    mailInquiry: "메일 문의",
    logOut: "로그아웃",
    secession: "탈퇴",
  });
  const [providersMap] = useState(new Map([
    ["google.com", {text:"구글로 로그인",src:constants.smoothy.images.appDrawer.settingGoogle}],
    ["facebook.com", {text:"페이스북으로 로그인",src:constants.smoothy.images.appDrawer.settingFacebook}],
  ]))

  const drawerFunction = useCallback(
    (text: string, index: number) => {
      switch (text) {
        case drawerFuntionNames.changeUserName:
          setChangeUserNameDialogOpen(!changeUserNameDialogOpen);
          break;
        case drawerFuntionNames.logOut:
          if (user) dispatch({ type: SIGN_OUT, payload: user.key });
          break;
        case drawerFuntionNames.secession:
          resign({}).then((res) => {
            if (res && res.success === true) {
              logger("탈퇴성공");
              dispatch({ type: SIGN_OUT });
            } else {
              console.error("탈퇴실패", res);
              // alert(
              //   "탈퇴로직 실행 중 error 가 있었습니다. 잠시 기다린 후 다시 시도 해 주세요"
              // );
              dispatch({
                type: SET_ALERT_SNACKBAR,
                payload: {
                  severity: AlertSeverityProvider.error,
                  alertMessage: `탈퇴로직 실행 중 error 가 있었습니다. 잠시 기다린 후 다시 시도 해 주세요`,
                },
              });
              dispatch({ type: SIGN_OUT });
            }
          });
          break;
        case drawerFuntionNames.faq:
          window.open(
            "https://cat-measure-146.notion.site/FAQ-f72526024b1c4130ad0bb200ef332e84",
            "_blank"
          );
          break;
        case drawerFuntionNames.termsOfService:
          window.open(
            "https://smoothy.co/eula/smoothy",
            "_blank"
          );
          break;
        case drawerFuntionNames.privacyPolicy:
          window.open(
            "https://smoothy.co/privacy/smoothy",
            "_blank"
          );
          break;
        default:
          console.error("[drawerFunction] no function call");
          break;
      }
    },
    [changeUserNameDialogOpen, dispatch, drawerFuntionNames.changeUserName, drawerFuntionNames.faq, drawerFuntionNames.logOut, drawerFuntionNames.privacyPolicy, drawerFuntionNames.secession, drawerFuntionNames.termsOfService, user]
  );
  const getListItem = useCallback(
    (text: string, index: number) => {
      switch (text) {
        case drawerFuntionNames.myId:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingId}
                    alt="my id"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  // secondary={"서비스중이 아닙니다."}
                  secondary={myProfile?.username}
                />
              </div>
            </ListItem>
          );
        // break;
        case drawerFuntionNames.changeUserName:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingNickname}
                    alt="nickname"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText primary={text} secondary={myProfile?.nickname} />
              </div>
            </ListItem>
          );
        // break;
        case drawerFuntionNames.googleLogin:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    // src={constants.smoothy.images.appDrawer.settingGoogle}
                    src={firebaseProfile && providersMap.get(firebaseProfile?.providerId)?.src? providersMap.get(firebaseProfile?.providerId)?.src : constants.smoothy.images.appDrawer.settingGoogle}
                    alt="nickname"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  // primary={text}
                  primary={firebaseProfile && providersMap.get(firebaseProfile?.providerId)?.text? providersMap.get(firebaseProfile?.providerId)?.text : "알 수 없는 제공자"}
                  secondary={`${firebaseProfile?.displayName} `}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.version:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingVersion}
                    alt="version"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={constants.smoothy.appVersion}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.faq:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingHelp}
                    alt="faq"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={" "}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.termsOfService:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingLink}
                    alt="terms of service"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={" "}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.privacyPolicy:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingLink}
                    alt="privacy policy"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={" "}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.mailInquiry:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingFeedback}
                    alt="main inquiry"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={"서비스중이 아닙니다."}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.logOut:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingLogout}
                    alt="log out"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={" "}
                />
              </div>
            </ListItem>
          );
        case drawerFuntionNames.secession:
          return (
            <ListItem button key={text} disabled={buttonDisable}>
              <div
                onClick={() => drawerFunction(text, index)}
                className={classes.drawerListItemWrapperDiv}
              >
                <ListItemIcon className={classes.drawerListItemIcon}>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <img
                    src={constants.smoothy.images.appDrawer.settingDeleteaccount}
                    alt="delete account"
                    className={classes.drawerListItemImg}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  secondary={" "}
                />
              </div>
            </ListItem>
          );
        default:
          console.error("[drawerFunction] no function call");
          break;
      }
    },
    [buttonDisable, classes.drawerListItemIcon, classes.drawerListItemImg, classes.drawerListItemWrapperDiv, drawerFunction, drawerFuntionNames.changeUserName, drawerFuntionNames.faq, drawerFuntionNames.googleLogin, drawerFuntionNames.logOut, drawerFuntionNames.mailInquiry, drawerFuntionNames.myId, drawerFuntionNames.privacyPolicy, drawerFuntionNames.secession, drawerFuntionNames.termsOfService, drawerFuntionNames.version, firebaseProfile, myProfile?.nickname, myProfile?.username, providersMap]
  );

  const changeProfileImgDialogClick = useCallback(() => {
    setChangeProfileImgDialogOpen(!changeProfileImgDialogOpen);
  }, [changeProfileImgDialogOpen]);
  return (
    <AppDrawerStyle>
      {/* <React.Fragment key={anchor}> */}
      {/* <Button style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }} onClick={() => setDrawerOpen(true)}>{anchor}</Button> */}

      {drawerOpen ? (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: constants.smoothy.zidx.btn,
          }}
          onClick={() => setDrawerOpen(false)}
          disabled={buttonDisable}
        >
          {/* <ArrowBackIosIcon /> */}
          <img src={constants.smoothy.images.menuSetting} alt="menu setting" />
        </IconButton>
      ) : (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: constants.smoothy.zidx.btn,
          }}
          onClick={() => setDrawerOpen(true)}
          disabled={buttonDisable}
        >
          {/* <MenuOpenIcon /> */}
          <img src={constants.smoothy.images.menuSetting} alt="menu setting" />
        </IconButton>
      )}
      <Drawer
        anchor={anchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {/* {list(anchor)} */}
        <List dense>
          <ListItem key={"close drawer"}>
            <ListItemIcon>
              {/* <ArrowBackIosIcon
                onClick={() => setDrawerOpen(false)}
                style={{ backgroundColor: "skyblue", cursor: "pointer" }}
              /> */}
              <img
                src={constants.smoothy.images.menuSetting}
                onClick={() => setDrawerOpen(false)}
                style={{ cursor: "pointer" }}
                alt="menu setting"
              />
              {/* <ListItemText primary={"설정"} /> */}
            </ListItemIcon>
            설정
          </ListItem>
          <div id="drawer-profile-div" className={classes.profileDiv}>
            {/* <Avatar className="avatar"> */}
            <Avatar
              // className={classes.avatar}
              className={`${classes.avatar} ${classes.cursorPointer}`}
              onClick={changeProfileImgDialogClick}
              // src={
              //   profile?.photoUriString
              //     ? profile?.photoUriString
              //     : constants.smoothy.images.ufoSvg
              // }
            >
              {myProfile?.photoUriString ? (
                <img
                  src={myProfile?.photoUriString}
                  alt="profile"
                  className={classes.avatarImg}
                />
              ) : (
                <img
                  src={constants.smoothy.images.ufoSvg}
                  alt="profile"
                  className={classes.avatarImg}
                />
              )}
            </Avatar>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              // className="margin-top"
              className={`margin-top ${classes.cursorPointer}`}
              onClick={changeProfileImgDialogClick}
            >
              {"프로필 이미지 변경"}
            </Typography>
          </div>

          {/* {["내 아이디", drawerFuntionNames.changeUserName, "구글 로그인"].map( */}
          {[
            drawerFuntionNames.myId,
            drawerFuntionNames.changeUserName,
            drawerFuntionNames.googleLogin,
          ].map((text, index) => getListItem(text, index))}
        </List>
        {/* <Divider/> */}
        <List
          disablePadding={true}
          dense={true}
          style={{ backgroundColor: "lightgray" }}
        >
          {["서비스 정보"].map((text, index) => (
            <ListItem button key={text} disabled={buttonDisable}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <List dense>
          {[
            drawerFuntionNames.version,
            drawerFuntionNames.faq,
            drawerFuntionNames.termsOfService,
            drawerFuntionNames.privacyPolicy,
            drawerFuntionNames.mailInquiry,
          ].map((text, index) => getListItem(text, index))}
        </List>
        {/* <Divider /> */}
        <List disablePadding dense style={{ backgroundColor: "lightgray" }}>
          {["계정"].map((text, index) => (
            <ListItem button key={text} disabled={buttonDisable}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <List dense>
          {[drawerFuntionNames.logOut, drawerFuntionNames.secession].map(
            (text, index) =>
              // <ListItem
              //   button
              //   key={text}
              //   onClick={
              //     onClickFuntions[
              //       text === "로그아웃"
              //         ? text
              //         : text === "탈퇴"
              //         ? text
              //         : "로그아웃"
              //     ]
              //   }
              // >
              //   <ListItemIcon>
              //     {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              //   </ListItemIcon>
              //   <ListItemText
              //     primary={text}
              //     secondary={"함수 넣었으니 함부로 누르지 마세요"}
              //   />
              // </ListItem>
              getListItem(text, index)
          )}
        </List>
      </Drawer>
      {/* </React.Fragment> */}
      <div>
        <ChangeProfileImgDialog
          open={changeProfileImgDialogOpen}
          setOpen={setChangeProfileImgDialogOpen}
        />
      </div>
      <div>
        <ChangeNicknameDialog
          open={changeUserNameDialogOpen}
          setOpen={setChangeUserNameDialogOpen}
        />
      </div>
    </AppDrawerStyle>
  );
}
export default AppDrawer;
