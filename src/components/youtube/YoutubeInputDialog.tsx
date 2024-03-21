import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getYoutubeVideoInfoOembed } from "../../lib/api/posts";
import logger from "../../lib/custom-logger/logger";
import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";

const YoutubeInputDialogStyle = styled.div``;
type YoutubeInputDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  addVideo: (url: string) => void;
};
// eslint-disable-next-line no-empty-pattern
function YoutubeInputDialog({
  open,
  setOpen,
  addVideo,
}: YoutubeInputDialogProps) {
  const classes = useStyles()
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [videoData, setVideoData] = useState(undefined as any);
  const [videoUrl, setVideoUrl] = useState("");
  const dialogHandleClose = useCallback(() => {
    if (open) {
      setOpen(false);
      setIsValidUrl(false);
      setVideoData(undefined as any)
      setVideoUrl("")
    }
  }, [open, setOpen]);
  const addVideoDialogHandleClose = useCallback(() => {
    addVideo(videoUrl);
    logger("[addVideoDialogHandleClose]");
    dialogHandleClose()
  }, [addVideo, videoUrl, dialogHandleClose]);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const youtubeUrl = e.target.value;
    setVideoUrl(youtubeUrl);
    if (youtubeUrl.startsWith("https://")) {
      getYoutubeVideoInfoOembed(youtubeUrl)
        .then(function (data) {
          setIsValidUrl(true);
          setVideoData(data);
        })
        .catch(function (error) {
          setIsValidUrl(false);
        });
    }
  }, []);
  const renewVideoUrl = useCallback(() => {
    setIsValidUrl(false);
    setVideoData(undefined);
  }, []);
  return (
    <YoutubeInputDialogStyle>
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
              {"목록에 영상 추가하기"}
            </Typography>
          </div>
          {isValidUrl && videoData ? (
            <>
              <img alt="thumbnail" src={videoData.thumbnailUrl} />
              <Typography
                variant="subtitle1"
                color="textPrimary"
                align="center"
              >
                {videoData.title}
              </Typography>
              <DialogActions>
                <Button
                  color="primary"
                  // type="submit"
                  // disabled={
                  //   disabled || !(chatlinkValid && !getChatlinkState.error)
                  // }
                  onClick={renewVideoUrl}
                  disabled={buttonDisable}
                  className={`${classes.root}`}
                  variant="contained"
                >
                  {"새링크"}
                </Button>
                <Button
                  color="primary"
                  // type="submit"
                  // disabled={
                  //   disabled || !(chatlinkValid && !getChatlinkState.error)
                  // }
                  onClick={addVideoDialogHandleClose}
                  disabled={buttonDisable}
                  className={`${classes.root}`}
                  variant="contained"
                >
                  {"추가하기"}
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <div className="full-width">
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  align="center"
                >
                  {"유튜브 URL 링크를 입력하세요"}
                </Typography>
              </div>
              <TextField
                autoFocus
                margin="dense"
                // label="유효하지 않은 주소입니다."
                type="url"
                fullWidth
                placeholder={"유튜브 URL 링크를 입력하세요"}
                // placeholder={placeHolder?placeHolder:"통화링크 URL을 입력하세요"}
                onChange={onChange}
                // error={!(chatlinkValid && !getChatlinkState.error)}
                // value={value}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </YoutubeInputDialogStyle>
  );
}

export default YoutubeInputDialog;
