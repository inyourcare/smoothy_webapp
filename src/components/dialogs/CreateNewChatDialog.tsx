import styled from "styled-components";
import { Button, Dialog, DialogActions, Typography } from "@material-ui/core";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import { copyToClipboard } from "../../lib/util/stringUtils";
import { useEffect } from "react";
import { createOpenChatFunctions, getPartyId } from "../../lib/firebase";
import logger, { errorLogger } from "../../lib/custom-logger/logger";
import constants from "../../lib/common/constants";
import { useStyles } from "../common/CustomStyle";

const CreateNewChatDialogStyle = styled.div``;
type CreateNewChatDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
// eslint-disable-next-line no-empty-pattern
function CreateNewChatDialog({ open, setOpen }: CreateNewChatDialogProps) {
  const { twilioVideoChatProps } = useSelector(
    (state: RootState) => state.smoothy
  );
  const { partyNo } = twilioVideoChatProps
    ? twilioVideoChatProps
    : { partyNo: null };
  const [link, setLink] = useState("");
  const [linkNotLoaded, setLinkNotLoaded] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const classes = useStyles();
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const dialogHandleClose = useCallback(() => {
    if (open) {
      setOpen(false);
      setLinkCopied(false);
      setLinkNotLoaded(true);
      setLink("");
    }
  }, [open, setOpen]);
  // const leaveRoomDialogHandleClose = useCallback(() => {
  //   copyTheLink()
  //   if (open) setOpen(false);
  // }, [open, setOpen, copyTheLink]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    const createOpenChatFunctionsCallback = function (partyId: string) {
      logger('[defaultEffect] createOpenChatFunctionsCallback' , partyId)
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
    if (linkNotLoaded === true) {
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
    }
  }, [linkNotLoaded, partyNo]);
  return (
    <CreateNewChatDialogStyle>
      <Dialog
        open={open}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <div className={classes.rootContainer}>
          {/* <DialogTitle id="form-dialog-title"> */}
          <div className={classes.mainContainer}>
            <Typography
              variant="h6"
              color="textPrimary"
              // className="dialog-main-text"
              align="center"
            >
              {partyNo?"통화 링크로 초대하기":"새 통화 시작"}
            </Typography>
            {/* </DialogTitle> */}
            {/* <DialogContent> */}
            <Typography
              variant="body2"
              color="textPrimary"
              // className="dialog-main-text"
              align="center"
            >
              {"통화 링크를 친구에게 공유해보세요"}
            </Typography>
            {/* <div className="link-div">{link}</div> */}
            <div className={classes.urlTextDiv}>
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.urlText}
                align="center"
                // gutterBottom
              >
                {link}
              </Typography>
            </div>
          </div>
          <DialogActions>
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
          {/* </DialogContent> */}
        </div>
      </Dialog>
    </CreateNewChatDialogStyle>
  );
}
export default CreateNewChatDialog;
