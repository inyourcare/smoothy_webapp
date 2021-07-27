import {
  Dialog,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import styled from "styled-components";
import logger from "../../lib/custom-logger/logger";
import { SET_SELECTED_AUDIO_DEVICE, SET_SELECTED_VIDEO_DEVICE } from "../../modules/twilio";
import { useStyles } from "../common/CustomStyle";
// import { RootState } from "../../modules";

const DeviceConfigDialogStyle = styled.div``;
type DeviceConfigDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
type OptionObject = {
  key: string;
  label: string;
  value: string;
  selected: boolean;
};
// eslint-disable-next-line no-empty-pattern
function DeviceConfigDialog({ open, setOpen }: DeviceConfigDialogProps) {
  // const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const dispatch = useDispatch()
  const [videoDeviceOptions, setVideoDeviceOptions] = useState(
    [] as Array<OptionObject>
  );
  const [videoSelected , setVideoSelected] = useState({} as OptionObject)
  const [audioDeviceOptions, setAudioDeviceOptions] = useState(
    [] as Array<OptionObject>
  );
  const [audioSelected , setAudioSelected] = useState({} as OptionObject)
  const classes = useStyles();

  const dialogHandleClose = useCallback(() => {
    if (open) setOpen(false);
  }, [open, setOpen]);

  const onVideoSelectChange = useCallback(function changeFunc(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    logger('[onVideoSelectChange]' , e.currentTarget.options.selectedIndex , videoDeviceOptions[e.currentTarget.options.selectedIndex], videoDeviceOptions)
    // var selectBox = document.getElementById("selectBox");
    setVideoSelected(videoDeviceOptions[e.currentTarget.options.selectedIndex])
    dispatch({type:SET_SELECTED_VIDEO_DEVICE,payload:videoDeviceOptions[e.currentTarget.options.selectedIndex].value})
    // var selectedValue = target.options[selectBox.selectedIndex].value;
    // alert(selectedValue);
  },
  [videoDeviceOptions,dispatch]);
  const onAudioSelectChange = useCallback(function changeFunc(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    logger('[onAudioSelectChange]' , e.currentTarget.options.selectedIndex , audioDeviceOptions[e.currentTarget.options.selectedIndex] , audioDeviceOptions)
    // var selectBox = document.getElementById("selectBox");
    setAudioSelected(audioDeviceOptions[e.currentTarget.options.selectedIndex])
    dispatch({type:SET_SELECTED_AUDIO_DEVICE,payload:audioDeviceOptions[e.currentTarget.options.selectedIndex].value})
    // var selectedValue = target.options[selectBox.selectedIndex].value;
    // alert(selectedValue);
  },
  [audioDeviceOptions,dispatch]);

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    function gotDevices(mediaDevices: MediaDeviceInfo[]) {
      let videoCount = 1;
      let audioCount = 1;
      logger("[gotDevices] mediaDevices::", mediaDevices , videoSelected , audioSelected);
      let videoList = new Array<OptionObject>();
      let audioList = new Array<OptionObject>();
      let videoSelectedProp = videoSelected.value? false:true;
      let audioSelectedProp = audioSelected.value? false:true;
      mediaDevices.forEach((mediaDevice) => {
        if (mediaDevice.kind === "videoinput") {
          // const option = document.createElement("option");
          const option: OptionObject = {
            value: mediaDevice.deviceId,
            label: mediaDevice.label,
            key: `video-option-${videoCount++}`,
            selected: videoSelected.value?videoSelected.value===mediaDevice.deviceId:videoSelectedProp,
          };
          videoList.push(option);
          videoSelectedProp = false;
          // videoSelect.appendChild(option);
        } else if (mediaDevice.kind === "audioinput") {
          // const option = document.createElement("option");
          const option: OptionObject = {
            value: mediaDevice.deviceId,
            label: mediaDevice.label,
            key: `audio-option-${audioCount++}`,
            selected: audioSelected.value?audioSelected.value===mediaDevice.deviceId:audioSelectedProp,
          };
          audioList.push(option);
          audioSelectedProp = false;
        }
      });
      setVideoDeviceOptions(videoList);
      setAudioDeviceOptions(audioList);
    }

    navigator.mediaDevices.enumerateDevices().then(gotDevices);
  }, [open,audioSelected,videoSelected]);
  return (
    <DeviceConfigDialogStyle>
      <Dialog
        open={open}
        onClose={dialogHandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <div>
          <Typography variant="h6" color="textPrimary" align="center">
            {"디바이스 설정"}
          </Typography>
          <DialogContent>
            <div className={classes.dialogContentDiv}>
              <Typography variant="caption" color="textPrimary">
                {"카메라 설정"}
              </Typography>
              <select id="video-select" onChange={onVideoSelectChange} value={videoSelected.value}>
                {videoDeviceOptions.map((option) => {
                  return (
                    <option
                      key={option.key}
                      value={option.value}
                      // selected={option.selected}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
              <Typography variant="caption" color="textPrimary">
                {"마이크"}
              </Typography>
              <select id="audio-select" onChange={onAudioSelectChange} value={audioSelected.value}>
                {audioDeviceOptions.map((option) => {
                  return (
                    <option
                      key={option.key}
                      value={option.value}
                      // selected={option.selected}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
              {/* <Typography variant="caption" color="textPrimary">
              {"스피커 설정"}
            </Typography>
            <select id="audio-select" /> */}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </DeviceConfigDialogStyle>
  );
}
export default DeviceConfigDialog;
