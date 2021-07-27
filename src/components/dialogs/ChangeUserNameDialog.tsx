import { useCallback, useState } from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogActions,
  Typography,
  Input,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../modules";
import { updateProfileNickname } from "../../lib/firebase";
import logger from "../../lib/custom-logger/logger";
import {
  AlertSeverityProvider,
  SET_ALERT_SNACKBAR,
} from "../../modules/smoothy";
import { useStyles } from "../common/CustomStyle";

const ChangeNicknameDialogStyle = styled.div``;
type ChangeNicknameDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
// eslint-disable-next-line no-empty-pattern
function ChangeNicknameDialog({ open, setOpen }: ChangeNicknameDialogProps) {
  const [nickname, setNickname] = useState("");
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const classes = useStyles();
  const dispatch = useDispatch();
  const dialogHandleClose = useCallback(() => {
    if (open) {
      setOpen(false);
    }
  }, [open, setOpen]);
  const changeNickname = useCallback(() => {
    updateProfileNickname(nickname)
      .then(function () {
        logger("[changeNickname] successfully done");
        dialogHandleClose();
      })
      .catch(function (error) {
        console.error("[changeNickname] updateProfileNickname error", error);
        // alert("닉네임 변경에 실패했습니다. 잠시 후 다시 시도 해 주세요");
        dispatch({
          type: SET_ALERT_SNACKBAR,
          payload: {
            severity: AlertSeverityProvider.error,
            alertMessage: `닉네임 변경에 실패했습니다. 잠시 후 다시 시도 해 주세요`,
          },
        });
        dialogHandleClose();
      });
  }, [dialogHandleClose, dispatch, nickname]);
  const nicknameOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  return (
    <ChangeNicknameDialogStyle>
      <Dialog
        open={open}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <div className={classes.changeUserNameDialogContainerDiv}>
          <Typography
            variant="h6"
            color="textPrimary"
            // className="dialog-main-text"
            align="center"
          >
            {`닉네임 변경`}
          </Typography>
          <Input
            // fullWidth
            placeholder="닉네임을 적어주세요"
            onChange={nicknameOnChange}
            className={classes.changeUserNameDialogInput}
          ></Input>
          <DialogActions className={classes.dialogAction}>
            <Button
              color="primary"
              // type="submit"
              // disabled={
              //   disabled || !(chatlinkValid && !getChatlinkState.error)
              // }
              // onClick={() => {
              //   setLinkCopied(true);
              //   copyToClipboard(link);
              // }}
              disabled={buttonDisable}
              variant="contained"
              onClick={changeNickname}
              className={`${classes.root}`}
            >
              변경하기
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </ChangeNicknameDialogStyle>
  );
}

export default ChangeNicknameDialog;
