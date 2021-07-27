import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import constants from "../../lib/common/constants";
import logger from "../../lib/custom-logger/logger";
import { testHttpsCallable } from "../../lib/firebase";
import { RootState } from "../../modules";
// import ChatroomPaticipantsDialog from "../home/ChatroomPaticipantsDialog";
// import CreateNewChatDialog from "../home/CreateNewChatDialog";
import DeviceConfigDialog from "../dialogs/DeviceConfigDialog";
import ChangeProfileImgDialog from '../dialogs/ChangeProfileImgDialog'
import EffectButtonSpace from '../EffectButtonSpace'

const Style = styled.div`
  .hi2 {
    position: absolute;
  }
  .dialog-main-text {
    /* font-weight: bold; */
  }
  .chatroomtoolbarcontainer {
    /* width: 352px; */
    height: 56px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin: 12px 90.5px 0 106.5px;
    padding: 8px 16px;
    border-radius: 16px;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    /* opacity: 0.1; */
    background-color: rgba(22, 22, 22, 0.6);
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
function ButtonTest() {
  const { actualUsers } = useSelector((state: RootState) => state.twilio);
  const [createNewChatDialogOpen, setCreateNewChatDialogOpen] = useState(false);
  const [participantsListDialogOpen, setParticipantsListDialogOpen] = useState(false);
  const [deviceConfigDialogOpen, setDeviceConfigDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [changeProfileImgDialogOpen, setChangeProfileImgDialogOpen] = useState(false);
  const disconnectOnClick = () => {
    setDisconnectDialogOpen(true);
  };
  const dialogHandleClose = useCallback(() => {
    if (disconnectDialogOpen) setDisconnectDialogOpen(false);
  }, [disconnectDialogOpen, setDisconnectDialogOpen]);

  return (
    <>
      <Style>
        <div id="chatroom-share-btn-div">
          {/* <Button disabled={buttonDisable}> */}
          <Button onClick={() => setParticipantsListDialogOpen(!participantsListDialogOpen)}>
            <div className="btn-background-div">
              {/* <span>워치파티</span> */}
              <img
                src={constants.smoothy.images.toolbar.memberCount}
                alt="member count"
                // onClick={() => toggleYoutubeMode()}
              />
              <span>{actualUsers.length}</span>
            </div>
          </Button>
          <Button
            onClick={() => setCreateNewChatDialogOpen(!createNewChatDialogOpen)}
          >
            <div className="btn-background-div">
              <img
                src={constants.smoothy.images.toolbar.shareChatlink}
                alt="share chatlink"
              />
            </div>
          </Button>
        </div>
        <div>
          <Button
            className="hi1"
            onClick={() => {
              testHttpsCallable("getCustomToken", {
                uid: "lQUN5sILzjO3jxkvK0nRH80pOat2",
              })
                .then(function (result) {
                  if (result) logger("testcall result::", result.data);
                })
                .catch(function (err) {
                  console.error("testcall err::", err);
                });
            }}
            variant="contained"
          >
            call the emulator function
          </Button>
          {/* <Button className="hi1">hihi<CircularProgress className="hi2"></CircularProgress></Button> */}
          <Button
            className="hi1"
            onClick={disconnectOnClick}
            variant="contained"
          >
            통화종료
          </Button>
          <Button
            className="hi1"
            onClick={()=>setChangeProfileImgDialogOpen(!changeProfileImgDialogOpen)}
            variant="contained"
          >
            프로필사진변경
          </Button>
          <Dialog
            open={disconnectDialogOpen}
            onClose={dialogHandleClose}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <DialogTitle id="form-dialog-title"></DialogTitle>
            <DialogContent>
              <Typography
                variant="h6"
                color="textPrimary"
                className="dialog-main-text"
              >
                {"정말 방을 나가시겠어요?"}
              </Typography>
              <DialogActions>
                <Button
                  color="primary"
                  // type="submit"
                  // disabled={
                  //   disabled || !(chatlinkValid && !getChatlinkState.error)
                  // }
                  onClick={dialogHandleClose}
                >
                  {"돌아가기"}
                </Button>
                <Button
                  color="primary"
                  // type="submit"
                  // disabled={
                  //   disabled || !(chatlinkValid && !getChatlinkState.error)
                  // }
                  onClick={dialogHandleClose}
                >
                  {"나가기"}
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </div>

        <div className="chatroomtoolbarcontainer">
          <Button
            onClick={() => {
              logger("1");
            }}
          >
            <img
              src={constants.smoothy.images.toolbar.cameraOn}
              // className="ic_chatroom_toolbar_camera_on"
              alt="camera"
            />
          </Button>
          <Button
            onClick={() => {
              logger("2");
            }}
          >
            <img
              src={constants.smoothy.images.toolbar.micOff}
              // className="ic_chatroom_toolbar_camera_on"
              alt="mic"
            />
          </Button>
          <EffectButtonSpace partyId="" fullscreenHammerEffectOnClick={()=>{}} hammerMode={false} setClose={(s:boolean)=>{}}/>
          <Button
            onClick={() => {
              logger("3");
            }}
          >
            <img
              src={constants.smoothy.images.toolbar.effect}
              // className="ic_chatroom_toolbar_camera_on"
              alt="effect"
            />
          </Button>
          <Button
            onClick={() => {
              logger("4");
            }}
          >
            <img
              src={constants.smoothy.images.toolbar.watchParty}
              // className="ic_chatroom_toolbar_camera_on"
              alt="watch party"
            />
          </Button>
          <Button
            onClick={()=>setDeviceConfigDialogOpen(!deviceConfigDialogOpen)}
          >
            <img
              src={constants.smoothy.images.toolbar.config}
              // className="ic_chatroom_toolbar_camera_on"
              alt="watch party config"
            />
          </Button>
          <Button
            onClick={() => {
              logger("5");
            }}
          >
            <img
              src={constants.smoothy.images.toolbar.exitRoom}
              // className="ic_chatroom_toolbar_camera_on"
              alt="exit room"
            />
          </Button>
          {/* <EffectButtonSpace partyId="hi" fullscreenHammerEffectOnClick={()=>{}} youtubeMode={false} key="key" hammerMode={false} setClose={(e)=>{}}/> */}
        </div>
        {/* <div>
          <CreateNewChatDialog
            open={createNewChatDialogOpen}
            setOpen={setCreateNewChatDialogOpen}
          />
        </div> */}
        {/* <div>
          <ChatroomPaticipantsDialog
            open={participantsListDialogOpen}
            setOpen={setParticipantsListDialogOpen}
          />
        </div> */}
        <div>
          <DeviceConfigDialog
            open={deviceConfigDialogOpen}
            setOpen={setDeviceConfigDialogOpen}
          />
        </div>
        <ChangeProfileImgDialog
          open={changeProfileImgDialogOpen}
          setOpen={setChangeProfileImgDialogOpen}
        />
      </Style>
    </>
  );
}

export default ButtonTest;
