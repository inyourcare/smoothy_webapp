import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";
const LeaveRoomDialogStyle = styled.div``;
type LeaveRoomDialogProps = { open: boolean; setOpen: (open: boolean) => void; leaveRoom:()=>void };
function LeaveRoomDialog({ open, setOpen, leaveRoom }: LeaveRoomDialogProps) {
  const classes = useStyles()
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const dialogHandleClose = useCallback(() => {
    if (open) setOpen(false);
  }, [open, setOpen]);
  const leaveRoomDialogHandleClose = useCallback(() => {
    leaveRoom()
    if (open) setOpen(false);
  }, [open, setOpen, leaveRoom]);
  return (
    <>
    <LeaveRoomDialogStyle>
      <Dialog
        open={open}
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
              disabled={buttonDisable}
              className={`${classes.root}`}
              variant="contained"
            >
              {"돌아가기"}
            </Button>
            <Button
              color="primary"
              // type="submit"
              // disabled={
              //   disabled || !(chatlinkValid && !getChatlinkState.error)
              // }
              onClick={leaveRoomDialogHandleClose}
              disabled={buttonDisable}
              className={`${classes.root}`}
              variant="contained"
            >
              {"나가기"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </LeaveRoomDialogStyle>
    </>
  );
}
export default LeaveRoomDialog;
