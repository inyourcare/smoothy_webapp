import { store } from "../..";
import { AlertSnackbarSeverity } from "../../components/snackbar/AlertSnackbar";
import { AlertSeverityProvider, SET_ALERT_SNACKBAR } from "../../modules/smoothy";

export default function logger (message?: any, ...optionalParams: any[]):any{
  return process.env.REACT_APP_LOG_ON==='1'?console.log(message,optionalParams):null
}

type errorLoggerParams = {
  id:string,
  description?:string,
  msg:string,
  error?:any,
}
export function errorLogger({id,description,msg,error}:errorLoggerParams, ...optionalParams: any[]):any{
  const statement = `[${id}] ${msg}`
  // alert(statement)
  store.dispatch({
    type: SET_ALERT_SNACKBAR,
    payload: {
      severity: AlertSeverityProvider.error as unknown as AlertSnackbarSeverity,
      alertMessage: statement,
    },
  });
  return console.error(statement, error ,optionalParams)
}