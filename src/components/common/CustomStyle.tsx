import {
  makeStyles,
} from "@material-ui/core";
import constants from "../../lib/common/constants";

const primaryColor = '#5568f9'

export const useStyles = makeStyles((theme) => ({
  changeUserNameDialogContainerDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  changeUserNameDialogInput:{
    width: "50%"
  },

  drawerListItemWrapperDiv: {
    width: "100%",
    display: "flex",
  },
  drawerListItemImg: {
    width: "24px",
    height: "24px",
  },
  drawerListItemIcon: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },

  profileDiv: {
    width: "100%",
    height: "12vh",
    display: "flex",
    // flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // textAlign: "center",
    // alignSelf: "center",
  },
  avatar: { 
    width: "50px",
    height: "50px",
    margin: theme.spacing(1),
  },
  avatarImg: {
    objectFit: "fill",
    /* width: "100%";
    height: "100%"; */
    width: "50px",
    height: "50px",
  },
  cursorPointer: {
    cursor: "pointer",
  },

  dialogAction: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImgDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imgDivContainer: {
    width: "100%",
    height: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImg: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
  },
  uploadLabel: {
    width: "100%",
    height: "100%",
  },
  buttonUntouchable: {
    pointerEvents: "none",
  },

  list: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    // flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  stateImg: {
    backgroundColor: "rgba(22, 22, 22, 0.6)",
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
    opacity: "0.7",
  },
  listItem: {
    width: "100%",
  },
  userDetailDiv: {
    width: "80%",
  },

  rootContainer: {
    display: "flex",
    // flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  mainContainer: {
    width: "80%",
  },
  urlTextDiv: {
    // width: "80%",
    // whiteSpace: "normal",
    // overflow: "hidden"
  },
  urlText: {
    width: "100%",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "normal",
    fontSize: "0.8rem",
  },

  homeMain: {
    position: "relative",
    height: "100vh",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
  contents: {
    // position: "absolute",
    // width: '100vw',
    // height: '100vh',
  },

  newChatStartBtn: {
    fontWeight: "bold",
    // backgroundColor: "aliceblue",
    backgroundColor: primaryColor,
    position: "absolute",
    left: "50%",
    transform: "translateX(-110%)",
    bottom: "10%",
  },
  linkInputBtn: {
    fontWeight: "bold",
    // backgroundColor: "aliceblue",
    backgroundColor: primaryColor,
    position: "absolute",
    left: "50%",
    transform: "translateX(10%)",
    bottom: "10%",
  },

  twilioPreview: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotateY(180deg)",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    "& > video": {
      width: "100%",
      objectFit: "cover",
      minHeight: "100%",
    },
  },
  cameraRefresh: {
    position: "absolute",
    top: "20%",
    left: "10%",
    zIndex: constants.smoothy.zidx.btn,
    // backgroundColor: "aliceblue",
  },

  registerBtn: {
    margin: theme.spacing(7, 0, 1),
  },
  fullWidth: {
    width: "100%",
    display: "block",
  },

  signInMain: {
    height: "100vh",
  },
  sideImage: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    // backgroundImage: "url(https://firebasestorage.googleapis.com/v0/b/smoothy-84e22.appspot.com/o/web%2Fsmoothy_web_main_artwork.png?alt=media&token=e895b747-b4de-420e-bdcf-8d48e4684f30)",
    backgroundRepeat: "no-repeat",
    // backgroundColor:
    //   theme.palette.type === "light"
    //     ? theme.palette.grey[50]
    //     : theme.palette.grey[900],
    backgroundColor: "#6242FB",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  // submit: {
  signInBtn: {
    margin: theme.spacing(0, 0, 1),
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
    fontWeight: "bold"
  },
  signInMainContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  nospacePaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bigSizeAvatar: { 
    width: "50%",
    height: "50%",
  },

  dialogContentDiv: {
    width: "100%",
    // backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
  },

  youtubeList: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

  youtubueListItem: {
    justifyContent: "left",
    padding: 0,
    // width: "100%"
  },
  capitalize: {
    textTransform: "capitalize",
  },

  registrationContainerMain: {
    position: "relative",
    height: "100vh",
  },
  registrationMainContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    transform: "translateY(-5%)",
    width: "50%",
  },

  root: {
    backgroundColor: "#5568f9",
    borderRadius: 20,
    border: 0,
    color: "white",
    height: 40,
    padding: "0 30px",
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  containedPrimary: {
    "&:hover": {
      backgroundColor: "#0e3583",
    },
  },
  submitdPrimary: {
    "&:hover": {
      backgroundColor: "#0e3583",
    },
  },

  typographyRoot: {
    color: "white",
  }
}));