// import { Button } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
// import { useSelector } from "react-redux";
import { provideOwnMedia, removeLocalVideoTrack } from "../../lib/twilio";
// import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";

function TwilioPreview() {
  // const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const classes = useStyles();
  const refreshCamera = useCallback(() => {
    return provideOwnMedia(document.getElementById("twilio-preview"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.getElementById("twilio-preview")]);
  useEffect(() => {
    // const track = provideOwnMedia(document.getElementById("twilio-preview"));
    const track = refreshCamera();
    return function cleanup() {
      track.then(function (t) {
        if (t) removeLocalVideoTrack(t);
      });
    };
  }, [refreshCamera]);
  return (
    <>
      <div id="twilio-preview" className={classes.twilioPreview} />
      {/* <div
        className={classes.cameraRefresh}
      >
        <Button
          variant="outlined"
          onClick={() => refreshCamera()}
          // className={classes.cameraRefresh}
          
          disabled={buttonDisable}
        >
          camera refresh
        </Button>
      </div> */}
    </>
  );
}

export default React.memo(TwilioPreview);
