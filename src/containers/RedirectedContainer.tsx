import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { redirectedChatlink } from '../lib/common/home';
import logger from '../lib/custom-logger/logger';
import {pushToHomeContainer} from '../lib/common/history';
import { AlertSeverityProvider, SET_ALERT_SNACKBAR } from '../modules/smoothy';

function RedirectedContainer() {
  const history = useHistory();
  const dispatch = useDispatch()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pathname = window.location.pathname;

    if (!urlParams.has('partyKey')&&!urlParams.has('inviteKey')){
      // alert('파라미터 에러입니다.')
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `파라미터 에러입니다.`,
        },
      });
      history.goBack()
    }

    const partyKey = urlParams.get('partyKey')
    const inviteKey = urlParams.get('inviteKey')
    const lastPath = pathname.split('/').pop()

    logger('[defaultEffect] params::' , inviteKey, partyKey , lastPath)
    if (lastPath === 'ch') {
      // openchat
      if (partyKey){
        redirectedChatlink(`/${lastPath}/${partyKey}`, dispatch)
        pushToHomeContainer(history)
      } else {
        // alert('오픈챗 링크가 필요합니다.')
        dispatch({
          type: SET_ALERT_SNACKBAR,
          payload: {
            severity: AlertSeverityProvider.error,
            alertMessage: `오픈챗 링크가 필요합니다.`,
          },
        });
        history.goBack()
      }
    } else if (lastPath === 'id'){
      // invite
      // alert('초대 링크 서비스는 아직 제공되지 않습니다. 오픈챗 링크로 다시시도 해 주세요')
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `초대 링크 서비스는 아직 제공되지 않습니다. 오픈챗 링크로 다시시도 해 주세요`,
        },
      });
      history.goBack()
    } else {
      // alert('잘못된 경로 접근입니다.')
      dispatch({
        type: SET_ALERT_SNACKBAR,
        payload: {
          severity: AlertSeverityProvider.error,
          alertMessage: `잘못된 경로 접근입니다.`,
        },
      });
      history.goBack()
    }
    return ()=>{
      logger('[leave RedirectedContainer]')
    }
  },[dispatch, history])

  return (
    <>
      
    </>
  );
}

export default RedirectedContainer;