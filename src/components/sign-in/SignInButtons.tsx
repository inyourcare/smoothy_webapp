import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup } from "../../lib/firebase";
import { RootState } from "../../modules";
import { useStyles } from "../common/CustomStyle";

function SignInButtons() {
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <>
      <Button
        // type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={`${classes.root} ${classes.signInBtn}`}
        onClick={() => signInWithPopup("Google" , dispatch)}
        disabled={buttonDisable}
      >
        구글로 로그인
      </Button>
      <Button
        // type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={`${classes.root} ${classes.signInBtn}`}
        onClick={() => signInWithPopup("Facebook" , dispatch)}
        disabled={buttonDisable}
      >
        페이스북으로 로그인
      </Button>
    </>
  );
}

export default SignInButtons;
