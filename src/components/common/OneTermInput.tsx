import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatlinkRequest } from "../../lib/common/home";
import logger from "../../lib/custom-logger/logger";
import { isChatlinkValid } from "../../lib/util/stringUtils";
import { RootState } from "../../modules";
import { useStyles } from "./CustomStyle";

type OneTermInputProps = {
  onInsert: (chatlink: string) => void;
  btnString: string;
  disabled?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  dialogMode?: boolean;
  setChatlinkSubmitted?: (value: boolean) => void;
  textFieldType?: string;
  placeHolder?: string;
};
function OneTermInput({
  onInsert,
  btnString,
  disabled,
  setOpen,
  open,
  dialogMode,
  setChatlinkSubmitted,
  placeHolder,
}: OneTermInputProps) {
  const { getChatlinkState } = useSelector(
    (state: RootState) => state.firebase
  );
  const classes = useStyles()
  const [value, setValue] = useState("");
  const [chatlinkValid, setChalinkValid] = useState(false);
  const dispatch = useDispatch();
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chatlink = e.target.value;
    setValue(chatlink);
    const chatlinkValid = isChatlinkValid(chatlink);
    setChalinkValid(chatlinkValid);
    logger('[OneTermInput onChange]',chatlinkValid,chatlink)
    // if (chatlinkValid) {
    //   const actualChatlink = chatlink.split("/").pop() as string;
    //   // dispatch({type:CLEAR_TO_BE_USER})
    //   chatlinkRequest(actualChatlink, dispatch);
    // }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setTimeout(() => {
      setSubmitDisabled(false);
    }, 1500);
    logger("[onSubmit]", value);
    onInsert(value);
    setValue("");
    chatlinkRequest("temporary_actual_chatlink", dispatch);
    if (setChatlinkSubmitted) setChatlinkSubmitted(true);
    if (setOpen) setOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chatlinkDialogHandleClose = useCallback(() => {
    if (setOpen) setOpen(false);
    setValue("");
    setChalinkValid(false);
  }, [setOpen]);
  return (
    <>
      {/* <form onSubmit={onSubmit}>  */}
      {/* {open && setOpen ? ( */}
      {dialogMode === true && (open === true || open === false) ? (
        <Dialog
          open={open}
          onClose={chatlinkDialogHandleClose}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <form onSubmit={onSubmit}>
            <DialogTitle id="form-dialog-title">
              {chatlinkValid && getChatlinkState.data ? (
                <>
                  <span>
                    {getChatlinkState.data.nickname}
                  </span>{" "}
                  님이{" "}
                  <span>
                    {/* {getChatlinkState.data.timestamp.toMillis
                      ? `${fromNow(
                          Number(getChatlinkState.data.timestamp.toMillis())
                        )}에 시작한 대화방입니다.`
                      : "시작한 대화방입니다."} */}
                      
                    {true
                      ? `PM 2:30 에 시작한 대화방입니다.`
                      : "시작한 대화방입니다."}
                  </span>{" "}
                </>
              ) : (
                "통화 링크 입력"
              )}
            </DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                    </DialogContentText> */}
              {/* <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Email Address"
                      type="email"
                      fullWidth
                    /> */}
              {/* <form onSubmit={onSubmit}> */}
              {/* <input
                placeholder="enter your invite code"
                value={value}
                onChange={onChange}
              /> */}
              <TextField
                autoFocus
                margin="dense"
                id="name"
                // label="유효하지 않은 주소입니다."
                type="url"
                fullWidth
                placeholder={
                  placeHolder ? placeHolder : "통화링크 URL을 입력하세요"
                }
                onChange={onChange}
                error={!(chatlinkValid && !getChatlinkState.error)}
                value={value}
              />
              <Typography
                variant="overline"
                color={
                  !(chatlinkValid && !getChatlinkState.error)
                    ? "error"
                    : "textPrimary"
                }
                display="block"
              >
                {chatlinkValid
                  ? getChatlinkState.loading
                    ? "링크 확인 중.."
                    : getChatlinkState.error
                    ? "잘못된 통화링크입니다."
                    : ""
                  : value === ""
                  ? ""
                  : "유효하지 않은 주소입니다."}
              </Typography>
              {/* </form> */}
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={chatlinkDialogHandleClose} color="primary">
              취소
            </Button>
            <Button onClick={chatlinkDialogHandleClose} color="primary">
              입력
            </Button> */}

              <Button
                color="primary"
                type="submit"
                // disabled={
                //   buttonDisable ||
                //   disabled ||
                //   submitDisabled ||
                //   !(chatlinkValid && !getChatlinkState.error)
                // }
                className={`${classes.root}`}
                variant="contained"
              >
                {btnString}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      ) : (
        <form onSubmit={onSubmit}>
          <div>
            <input
              placeholder={placeHolder ? placeHolder : "enter your invite code"}
              value={value}
              onChange={onChange}
            />
            <Button
              color="primary"
              type="submit"
              disabled={buttonDisable || disabled || submitDisabled}
              className={`${classes.root}`}
              variant="contained"
            >
              {btnString}
            </Button>
          </div>
        </form>
      )}
      {/* </form>  */}
    </>
  );
}

export default OneTermInput;
