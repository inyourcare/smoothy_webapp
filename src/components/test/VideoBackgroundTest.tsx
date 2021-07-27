import { Button, Container, Grid, makeStyles } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import React from "react";
import OneTermInput from "../common/OneTermInput";
import TwilioPreview from "../home/TwilioPreview";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100vh",
  },
  twilioPreview: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cameraRefresh: {},
  signOut: {
    position: "absolute",
    bottom: "10%",
  },
  resign: {
    position: "absolute",
    bottom: "5%",
  },
  videochatIframeDiv: {
    position: "absolute",
    bottom: "30%",
    right: "0%",
  },
  contents: {},
  inputDiv: {
    // background: "black",
    // zIndex: 20,
    position: "absolute",
    // width: "300px",
    // height: "300px"
  }
}));
function VideoBackgroundTest() {
  const classes = useStyles();
  return (
    <>
      <Grid container component="main" className={classes.root}>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <TwilioPreview />
            <div className={classes.contents}>
              <OneTermInput
                onInsert={(s: string) => {}}
                btnString="chatlink!"
              />
              <div className={classes.inputDiv}>
                <input placeholder="enter your invite code"/>
              </div>

              <Button
                color="primary"
                onClick={() => {}}
                className={classes.signOut}
              >
                Sign-out
              </Button>
              <Button
                color="primary"
                onClick={() => {}}
                className={classes.resign}
              >
                Resign
              </Button>
            </div>
          </div>
        </Container>
      </Grid>
    </>
  );
}

export default VideoBackgroundTest;
