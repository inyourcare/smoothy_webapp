import styled from "styled-components";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { SET_ALERT_SNACKBAR } from "../../modules/smoothy";

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export type AlertSnackbarSeverity = {
  error: "error";
  warning: "warning";
  info: "info";
  success: "success";
};
const AlertSnackbarStyle = styled.div``;
type AlertSnackbarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  severity: AlertSnackbarSeverity | null | undefined;
  alertMessage: string | null | undefined;
};
// eslint-disable-next-line no-empty-pattern
function AlertSnackbar({
  open,
  setOpen,
  severity,
  alertMessage,
}: AlertSnackbarProps) {
  // const classes = useStyles();
  const dispatch = useDispatch()
  const handleClose = useCallback(() => {
    if (open) {
      setOpen(false);
      dispatch({type:SET_ALERT_SNACKBAR,payload:null})
    }
  }, [dispatch, open, setOpen]);
  return (
    <AlertSnackbarStyle>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}> */}
      <Snackbar open={open} autoHideDuration={null} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </AlertSnackbarStyle>
  );
}

export default AlertSnackbar;
