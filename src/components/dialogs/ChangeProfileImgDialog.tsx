import {
  Button,
  Dialog,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";

const ChangeProfileImgDialogStyle = styled.div``;
type ChangeProfileImgDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
// eslint-disable-next-line no-empty-pattern
function ChangeProfileImgDialog({
  open,
  setOpen,
}: ChangeProfileImgDialogProps) {
  const classes = useStyles();
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const [selectedProfileImgFile, setSelectedProfileImgFile] = useState(
    {} as File
  );
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dialogHandleClose = useCallback(() => {
    if (open) {
      setOpen(false);
      setSelectedProfileImgFile({} as File);
      setIsFileSelected(false);
    }
  }, [open, setOpen]);
  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;
    if (files) {
      const imgFile = files[0];
      setSelectedProfileImgFile(imgFile);
      setIsFileSelected(true);
    }
  }, []);
  const changeProfile = useCallback(() => {
    if (isFileSelected === true && selectedProfileImgFile.size > 0) {
      // setIsUploading(true);
      // uploadProfileImage(selectedProfileImgFile, () => {
      //   setIsUploading(false);
      //   dialogHandleClose();
      // });
      dialogHandleClose();
    }
  // }, [dialogHandleClose, isFileSelected, selectedProfileImgFile]);
  }, [isFileSelected, selectedProfileImgFile.size,dialogHandleClose]);
  return (
    <ChangeProfileImgDialogStyle>
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
          {`프로필 이미지 변경`}
        </Typography>

        <div className={classes.imgDivContainer}>
          {isFileSelected && selectedProfileImgFile.size > 0 && (
            <div className={classes.previewImgDiv}>
              <img
                src={URL.createObjectURL(selectedProfileImgFile)}
                alt="profile"
                className={classes.previewImg}
              />
            </div>
          )}
        </div>
        <DialogActions className={classes.dialogAction}>
          <input
            accept="image/*"
            type="file"
            id="raised-button-file"
            hidden
            onChange={(e) => handleFiles(e)}
          />

          <label
            htmlFor="raised-button-file"
            className={`${classes.cursorPointer}`}
          >
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
              disabled={buttonDisable || isUploading}
              className={isFileSelected ? `${classes.root}` : `${classes.root} ${classes.buttonUntouchable}`}
              variant="contained"
              onClick={changeProfile}
            >
              {isFileSelected ? (
                <div>확인</div>
              ) : (
                // <label
                //   htmlFor="raised-button-file"
                //   className={`${classes.cursorPointer} ${classes.uploadLabel}`}
                // >
                // {/* <label
                //   htmlFor="raised-button-file"
                //   className={`${classes.cursorPointer}`}
                // > */}
                //   업로드
                // </label>
                "업로드"
              )}
            </Button>
          </label>
        </DialogActions>
      </Dialog>
    </ChangeProfileImgDialogStyle>
  );
}

export default ChangeProfileImgDialog;
