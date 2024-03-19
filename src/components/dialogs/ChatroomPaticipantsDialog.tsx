import {
  Button,
  Dialog,
  DialogActions,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import constants from "../../lib/common/constants";
import logger, { errorLogger } from "../../lib/custom-logger/logger";
import { createOpenChatFunctions, getPartyId } from "../../lib/firebase";
import { copyToClipboard } from "../../lib/util/stringUtils";
import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";

const ChatroomPaticipantsDialogStyle = styled.div``;
type ChatroomPaticipantsDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
// eslint-disable-next-line no-empty-pattern
function ChatroomPaticipantsDialog({
  open,
  setOpen,
}: ChatroomPaticipantsDialogProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [link, setLink] = useState("");
  const [linkNotLoaded, setLinkNotLoaded] = useState(true);
  const { videoChatUserProfiles, twilioVideoChatProps, buttonDisable } =
    useSelector((state: RootState) => state.smoothy);
  const { audio_enabled, video_enabled } = useSelector(
    (state: RootState) => state.twilio
  );
  const { partyNo } = twilioVideoChatProps
    ? twilioVideoChatProps
    : { partyNo: null };
  const classes = useStyles();
  var itemIndex = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    const createOpenChatFunctionsCallback = function (partyId: string) {
      logger('[participantsDialog defaultEffect] createOpenChatFunctionsCallback' , partyId)
      createOpenChatFunctions(`${partyId}`)
        .then(function (result) {
          setLink(
            constants.smoothy.openchatHost +
              constants.smoothy.openchatPath +
              result.openchatKey
          );
          setLinkNotLoaded(false);
        })
        .catch(function (error) {
          errorLogger({
            id: `${constants.smoothy.error.fail_to_create_new_chat.id}`,
            msg: `${constants.smoothy.error.fail_to_create_new_chat.msg}`,
            error,
          });
        });
    };
    if (partyNo) {
      createOpenChatFunctionsCallback(partyNo);
    } else {
      getPartyId()
        .then(createOpenChatFunctionsCallback)
        .catch(function (error) {
          errorLogger({
            id: `${constants.smoothy.error.fail_to_create_new_chat.id}`,
            msg: `${constants.smoothy.error.fail_to_create_new_chat.msg}`,
            error,
          });
        });
    }
  }, [partyNo]);

  // const profiles = Array.from(videoChatUserProfiles.values()).map((profile) => {
  const profiles = Array.from(videoChatUserProfiles.keys()).map((uid) => {
    const profile = videoChatUserProfiles.get(uid);
    if (profile)
      return (
        <ListItem
          key={`participants-dialog-item-${itemIndex++}`}
          className={classes.listItem}
        >
          <Avatar
            src={profile.photoUriString}
            sizes="10px"
            className={classes.profileImg}
          />{" "}
          <div className={classes.userDetailDiv}>
            <Typography align="left" noWrap variant="caption">
              {profile.username}
            </Typography>
          </div>
          {audio_enabled.filter((enabled_uid) => enabled_uid === uid).length ===
          0 ? (
            <Avatar
              src={constants.smoothy.images.toolbar.micOff}
              className={classes.stateImg}
              sizes="10px"
            />
          ) : (
            <Avatar
              src={constants.smoothy.images.toolbar.micOn}
              className={classes.stateImg}
              sizes="10px"
            />
          )}
          {video_enabled.filter((enabled_uid) => enabled_uid === uid).length ===
          0 ? (
            <Avatar
              src={constants.smoothy.images.toolbar.cameraOff}
              className={classes.stateImg}
              sizes="10px"
            />
          ) : (
            <Avatar
              src={constants.smoothy.images.toolbar.cameraOn}
              className={classes.stateImg}
              sizes="10px"
            />
          )}
        </ListItem>
      );
    else {
      return <></>;
    }
  });

  const dialogHandleClose = useCallback(() => {
    if (open) {
      setOpen(false);
      setLinkCopied(false);
      // setLinkNotLoaded(true);
      // setLink("");
    }
  }, [open, setOpen]);
  return (
    <ChatroomPaticipantsDialogStyle>
      <Dialog
        open={open}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <Typography
          variant="h6"
          color="textPrimary"
          // className="dialog-main-text"
          align="center"
        >
          {`참여 멤버 (${videoChatUserProfiles.size})`}
        </Typography>
        {videoChatUserProfiles.size > 0 && (
          <List className={classes.list}>{profiles}</List>
        )}
        <DialogActions className={classes.dialogAction}>
          {linkCopied === false ? (
            <Button
              color="primary"
              // type="submit"
              // disabled={
              //   disabled || !(chatlinkValid && !getChatlinkState.error)
              // }
              onClick={() => {
                setLinkCopied(true);
                copyToClipboard(link);
              }}
              disabled={buttonDisable || linkNotLoaded}
              // className={classes.copyLinkBtn}
              variant="contained"
              className={`${classes.root}`}
            >
              {"링크복사"}
            </Button>
          ) : (
            <Button
              color="primary"
              // type="submit"
              // disabled={
              //   disabled || !(chatlinkValid && !getChatlinkState.error)
              // }
              onClick={() => copyToClipboard(link)}
              disabled={buttonDisable || linkNotLoaded}
              variant="contained"
              className={`${classes.root}`}
            >
              {"링크가 복사되었어요!"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ChatroomPaticipantsDialogStyle>
  );
}

export default ChatroomPaticipantsDialog;
