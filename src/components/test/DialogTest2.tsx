import styled from "styled-components";
import {
  Dialog,
  DialogActions,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../modules";
import { useState } from "react";
import { copyToClipboard } from "../../lib/util/stringUtils";
import { createOpenChatFunctions, getPartyId } from "../../lib/firebase";
import { errorLogger } from "../../lib/custom-logger/logger";
import constants from "../../lib/common/constants";
import { AfterCopyLinkBtn, CopyLinkBtn } from '../common/CustomComponents'

const DialogTest2DialogStyle = styled.div`
  /* .dialog-container-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .full-width {
    width: 100%;
  }
  .align-center {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .link-div {
    width: 80%;
  } */
`;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  mainContainer: {
    width: "80%",
  },
  urlTextDiv: {
    // width: "80%",
    // whiteSpace: "normal",
    // overflow: "hidden"
  },
  urlText: {
    width: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "normal",
    fontSize: "0.8rem",
  },
}));
type DialogTest2DialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  copyTheLink: () => void;
};
// eslint-disable-next-line no-empty-pattern
function DialogTest2Dialog({
  open,
  setOpen,
  copyTheLink,
}: DialogTest2DialogProps) {
  const [link, setLink] = useState("");
  const [linkNotLoaded, setLinkNotLoaded] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const classes = useStyles();
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const dialogHandleClose = useCallback(() => {
    if (open) setOpen(false);
  }, [open, setOpen]);
  // const leaveRoomDialogHandleClose = useCallback(() => {
  //   copyTheLink()
  //   if (open) setOpen(false);
  // }, [open, setOpen, copyTheLink]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    getPartyId()
      .then(function (partyId) {
        createOpenChatFunctions(`party_${partyId}`)
        .then(function (result) {
          setLink(constants.smoothy.openchatHost + constants.smoothy.openchatPath + result.openchatKey);
          setLinkNotLoaded(false);
        })
        .catch(function(error){
          errorLogger({
            id: `${constants.smoothy.error.fail_to_create_new_chat.id}`,
            msg: `${constants.smoothy.error.fail_to_create_new_chat.msg}`,
            error,
          });
        })
      })
      .catch(function (error) {
        errorLogger({
          id: `${constants.smoothy.error.fail_to_create_new_chat.id}`,
          msg: `${constants.smoothy.error.fail_to_create_new_chat.msg}`,
          error,
        });
      });
  }, []);
  return (
    <DialogTest2DialogStyle>
      <Dialog
        open={open}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <div className={classes.mainContainer}>
          {/* <DialogTitle id="form-dialog-title"> */}
          <div className={classes.mainContainer}>
            <Typography
              variant="h6"
              color="textPrimary"
              // className="dialog-main-text"
              align="center"
            >
              {"새 통화 시작"}
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
              <CopyLinkBtn
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
              >
                {"링크복사"}
              </CopyLinkBtn>
            ) : (
              <AfterCopyLinkBtn
                color="primary"
                // type="submit"
                // disabled={
                //   disabled || !(chatlinkValid && !getChatlinkState.error)
                // }
                onClick={() => copyToClipboard(link)}
                disabled={buttonDisable || linkNotLoaded}
                variant="contained"
              >
                {"링크가 복사되었어요!"}
              </AfterCopyLinkBtn>
            )}
          </DialogActions>
          {/* </DialogContent> */}
        </div>
      </Dialog>
    </DialogTest2DialogStyle>
  );
}
export default DialogTest2Dialog;
