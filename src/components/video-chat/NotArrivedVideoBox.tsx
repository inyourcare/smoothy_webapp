import {
  Avatar,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import constants from "../../lib/common/constants";
import {
  FirestoreProfile,
  getCurrentUser,
  pingForceJoin,
} from "../../lib/firebase";
import { RootState } from "../../modules";
import { TwilioVideoChatProps } from "../../modules/smoothy";
import { useStyles } from "../common/CustomStyle";
import Progress from "../common/Progress";

const NotArrivedVideoBoxStyle = styled.div`
  /* background: "#" + backgroundColor; */
  /* background: ${"#" + Math.floor(Math.random() * 16777215).toString(16)};
  height: "100%";
  width: "100%";
  position: "absolute";
  right: 0;
  top: 0;
  display: "flex";
  flex-wrap: "wrap";
  justify-content: "center";
  align-items: "center"; */

  .avatar {
    /* width: 30%;
    height: 30%; */
    width: 180px;
    height: 180px;
    max-width: 180px;
    max-height: 180px;
  }
  .avatar-img {
    object-fit: fill;
    /* width: "30%";
    height: "30%"; */
    width: 180px;
    height: 180px;
    max-width: 180px;
    max-height: 180px;
  }
  .margin-top {
    margin-top: 5%;
  }
  .displayOn {
    display: block;
  }
  .displayNone {
    display: none;
  }
  .progress-div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
type NotArrivedVideoBoxProps = {
  uid: string;
  // profile?: FirestoreProfile;
  profiles?: Map<string, FirestoreProfile>;
};

function NotArrivedVideoBox({ uid, profiles }: NotArrivedVideoBoxProps) {
  const classes = useStyles()
  const smoothyColor = ['#716DF9','#FF6EE8','#00B6C1','#6384FF','#FF5E88','#932BFB']
  const [backgroundColor] = useState(
    // Math.floor(Math.random() * 16777215).toString(16)
    smoothyColor[Math.floor(Math.random() * 6)]
  );
  const [profileImg, setProfileImg] = useState(
    profiles?.get(uid)?.photoUriString
  );
  const { pingListMap, buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const { twilioVideoChatProps } = useSelector(
    (state: RootState) => state.smoothy
  );
  const { partyNo, sender } = twilioVideoChatProps as TwilioVideoChatProps;
  const [reForceBtnDisabled, setReforceBtnDisabled] = useState(false);
  // const [reforcePingProgress, setReforcePingProgress] = useState(false);

  //
  // callback
  const reForcePing = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (partyNo && sender)
        pingForceJoin(
          getCurrentUser()?.displayName as string,
          sender,
          1,
          partyNo
        );
      // const progress = document.getElementById("reforce-ping-progress");
      // const self = document.getElementById("reforce-ping-btn")
      // progress?.classList.remove("displayNone");
      // progress?.classList.add("displayOn");
      setReforceBtnDisabled(true);

      // progress?.setAttribute("style" , "display:block")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const disableTimeout = setTimeout(() => {
        // e.currentTarget.disabled = false;
        // progress?.setAttribute("style" , "display:none")
        // progress?.classList.remove("displayOn");
        // progress?.classList.add("displayNone");
        setReforceBtnDisabled(false);
      }, 10000);
    },
    [sender, partyNo]
  );
  const isNew = () => {
    return partyNo
      ? Number(
          pingListMap
            ?.get(partyNo)
            ?.filter((e) => e.uid === uid && e.come === false)?.length
        ) > 0
      : false;
  };
  // 상태문구 -> {isNew() ? "탑승중" : "자리비움"} 으로 했더니 상대가 왔을때 자리비움으로 텍스트 체인지되는 현상이 있어 수정
  // 탑승중은 상대가 확실히 반응했을 때 :: state 2 번일 때 탑승중 변경
  const [stateDescription] = useState(isNew() ? "부르는중" : "");
  //
  // effect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const profileImgEffect = useEffect(() => {
    const profileImgInterval = setInterval(() => {
      if (profiles?.get(uid)?.photoUriString) {
        setProfileImg(profiles?.get(uid)?.photoUriString);
        clearInterval(profileImgInterval);
      }
    }, 1000);
    return () => {
      clearInterval(profileImgInterval);
    };
    // }, [profiles?.get(uid)?.photoUriString]);
  }, [profiles, uid]);
  return (
    <NotArrivedVideoBoxStyle>
      <div
        style={{
          background: backgroundColor,
          height: "100%",
          width: "100%",
          position: "absolute",
          right: 0,
          top: 0,
          display: "flex",
          // flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Avatar className={classes.avatar}> */}
        <Avatar className="avatar">
          {profileImg ? (
            <img src={profileImg} alt="profile" className="avatar-img" />
          ) : (
            <img
              src={constants.smoothy.images.ufoSvg}
              alt="profile"
              className="avatar-img"
            />
          )}
          {/* {Number(
            pingListMap
              ?.get(partyNo)
              ?.filter((e) => e.uid === uid && e.come === false)?.length
          ) > 0 ? ( */}
          {isNew() ? (
            <div className="progress-div">
              <Progress />
            </div>
          ) : (
            <></>
          )}
        </Avatar>
        <Typography
          variant="h6"
          color="textPrimary"
          display="block"
          className={`margin-top ${classes.typographyRoot}`}
        >
          {profiles?.get(uid)?.nickname}
        </Typography>
        {uid === getCurrentUser()?.uid ? (
          <>
            <Typography
              variant="caption"
              color="textPrimary"
              display="block"
              className={`margin-top ${classes.typographyRoot}`}
            >
              나
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="caption"
              color="textPrimary"
              display="block"
              className="margin-top"
            >
              {/* {Number(
                pingListMap
                  ?.get(partyNo)
                  ?.filter((e) => e.uid === uid && e.come === false)?.length
              ) > 0 */}
              {/* {isNew() ? "탑승중" : "자리비움"} */}
              {stateDescription}
            </Typography>
            <Button
              variant="contained"
              className={`margin-top ${classes.root}`}
              onClick={reForcePing}
              id="reforce-ping-btn"
              disabled={buttonDisable || reForceBtnDisabled}
              style={{ zIndex: constants.smoothy.zidx.btn }}
            >
              {"다시부르기"}
              {reForceBtnDisabled ? (
                <div className="progress-div">
                  <CircularProgress
                    id="reforce-ping-progress"
                    className="displayNone"
                  ></CircularProgress>
                </div>
              ) : (
                ""
              )}
            </Button>
          </>
        )}
      </div>
    </NotArrivedVideoBoxStyle>
  );
}
export default NotArrivedVideoBox;
