import styled from "styled-components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { useCallback } from "react";
import { RootState } from "../../modules";
import { useSelector } from "react-redux";
import { YoutubeVideoType } from "./types";
import { useStyles } from "../common/CustomStyle";
const YoutubePlayNowDialogStyle = styled.div``;
type YoutubePlayNowDialogProps = {
  open: boolean;
  video: YoutubeVideoType;
  setOpen: (open: boolean) => void;
  setVideo: (video: YoutubeVideoType) => void;
  onVideoSelect: (video: YoutubeVideoType) => void;
};
// eslint-disable-next-line no-empty-pattern
function YoutubePlayNowDialog({
  open,
  video,
  setOpen,
  setVideo,
  onVideoSelect,
}: YoutubePlayNowDialogProps) {
  const classes = useStyles()
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const dialogHandleClose = useCallback(() => {
    if (open) setOpen(false);
  }, [open, setOpen]);
  const playNowAndClose = useCallback(() => {
    if (open) {
      onVideoSelect(video)
      setVideo(undefined as unknown as YoutubeVideoType)
      setOpen(false);
    }
  }, [open, setOpen, onVideoSelect, setVideo, video]);
  return (
    <YoutubePlayNowDialogStyle>
      <Dialog
        open={open}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="full-width">
            <Typography variant="h6" color="textPrimary" align="center">
              {"지금 재생 하시겠습니까?"}
            </Typography>
          </div>
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
              {"취소"}
            </Button>
            <Button
              color="primary"
              // type="submit"
              // disabled={
              //   disabled || !(chatlinkValid && !getChatlinkState.error)
              // }
              onClick={playNowAndClose}
              disabled={buttonDisable}
              className={`${classes.root}`}
              variant="contained"
            >
              {"확인"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </YoutubePlayNowDialogStyle>
  );
}
export default YoutubePlayNowDialog;
