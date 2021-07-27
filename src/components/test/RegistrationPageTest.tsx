import styled from 'styled-components'
import {
  Avatar,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import constants from '../../lib/common/constants';
import RegistrationInputs, {
} from "../registration/RegistrationInputs";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100vh",
  },
  mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    transform: "translateY(-5%)",
    width: "50%",
  },
  paper: {
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signOut: {
    position: "absolute",
    bottom: "10%",
  },
  avatar: {
    width: "50%",
    height: "50%",
  },
  icon: {
    objectFit: "fill",
    width: "100%",
    height: "100%",
  },
  mainText: {
    textAlign: "center",
    justifyContent: "center",
    marginTop: "10%",
  },
}));
const RegistrationPageTestStyle = styled.div``;
type RegistrationPageTestProps = {};
// eslint-disable-next-line no-empty-pattern
function RegistrationPageTest({}: RegistrationPageTestProps) {
  const classes = useStyles();
  return (
    <RegistrationPageTestStyle>
      <Grid container component="main" className={classes.mainContainer}>
          <Container
            component="main"
            maxWidth="xs"
            className={classes.mainContainer}
          >
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                  <img
                    src={constants.smoothy.images.ufo}
                    className={classes.icon}
                    alt="profile"
                  />
              </Avatar>
              <Typography
                component="h1"
                variant="h6"
                className={classes.mainText}
              >
                8명까지 함께 그룹 영상통화해요 ⚡️ <br />시간 제한 없이 무료로 즐기세요
              </Typography>
              <div className="registration-container-div">
                <RegistrationInputs onRegister={()=>{}} />
              </div>
            </div>
          </Container>
        </Grid>
    </RegistrationPageTestStyle>
  );
}

export default RegistrationPageTest;