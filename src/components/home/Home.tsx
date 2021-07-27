import { Button, Grid } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TwilioPreview from "./TwilioPreview";
import { RootState } from "../../modules";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import constants from "../../lib/common/constants";
import { useStyles } from "../common/CustomStyle";

const HomeStyle = styled.div`
  #new-chat-start-btn {
    font-weight: bold;
    background-color: aliceblue;
    position: absolute;
    left: 50%;
    transform: translateX(-110%);
    bottom: 10%;
    /* z-index:  ${constants.smoothy.zidx.btn}; */
    width: 15%;
  }
  #link-input-btn {
    font-weight: bold;
    background-color: aliceblue;
    position: absolute;
    left: 50%;
    transform: translateX(10%);
    bottom: 10%;
    /* z-index:  ${constants.smoothy.zidx.btn}; */
    width: 15%;
  }
`;

type HomeProps = {};

// eslint-disable-next-line no-empty-pattern
function Home({}: HomeProps) {
  const { roomConnected, buttonDisable } = useSelector(
    (state: RootState) => state.smoothy
  );

  const classes = useStyles();
  const history = useHistory();

  const gobackToVideochat = useCallback(() => {
    history.push({
      pathname: "/videochat",
    });
  }, [history]);

  return (
    <>
      <HomeStyle>
        <TwilioPreview />
        <Grid container component="main" className={classes.homeMain}>
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <div className={classes.contents}>
                <div
                  id="videochat-iframe-div"
                  className={classes.videochatIframeDiv}
                >
                  {roomConnected && (
                    // ? <div>connected<br/><div><iframe title="now videochat" src="http://localhost:3000/videochat"></iframe></div></div>
                    <div>
                      connected
                      <br />
                      <div>
                        <Button
                          onClick={gobackToVideochat}
                          disabled={roomConnected?false:true || buttonDisable}
                          className={`${classes.root}`}
                          variant="contained"
                        >
                          goback to videochat
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Grid>
      </HomeStyle>
    </>
  );
}

export default Home;
