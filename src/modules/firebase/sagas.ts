import { getChatLink, updateProfileWhenDeactivated, unsbscribeFriends, subscribeFriendList, getChatlinkFunctions, signOutCalled} from "../../lib/firebase";
import {
  SIGN_OUT,
  getChatlinkAsyncAction,
  GET_CHATLINK ,
  SIGN_IN,
  setSignInUserAction,
  signOutAction,
  CLEAR_FRIENDS,
  SIGN_OUT_CLEAR_DATA,
  GET_CHATLINK_FUNCTIONS,
  getChatlinkFunctionsAsyncAction
} from "./actions";
import { call, delay, put, takeEvery } from "redux-saga/effects";
import createAsyncSaga from "../../lib/createAsyncSaga";
import logger from "../../lib/custom-logger/logger";
import { SET_BUTTON_DISABLE, SET_BUTTON_ENABLE } from "../smoothy";
// import { deactivateYoutubeAction, DEACTIVATE_YOUTUBE } from "../smoothy";

export function* firebaseSaga() {
  // yield takeEvery(SIGN_IN_WITH_POPUP, signInWithPopupSaga);
  yield takeEvery(GET_CHATLINK, getChatlinkSaga());
  // yield takeEvery(GET_CHATLINK, getChatlinkSaga);
  yield takeEvery(GET_CHATLINK_FUNCTIONS, getChatlinkFunctionsSaga());
  // yield takeEvery(GET_CHATLINK_FUNCTIONS, getChatlinkFunctionsSaga);
  yield takeEvery(SIGN_IN, signInSaga);
  yield takeEvery(SIGN_OUT, signOutSaga);
  // yield takeEvery(DEACTIVATE_YOUTUBE, deactivateYoutubeSaga);
}

// function* deactivateYoutubeSaga(action:ReturnType<typeof deactivateYoutubeAction>){
//   if(action && action.payload){
//     yield call(removePlayback , action.payload)
//     yield call(removeItemsFromPlayList , action.payload)
//   }
// }

function* signInSaga(action:ReturnType<typeof setSignInUserAction>){
  // yield call(updateProfileWhenActivated,action) <= 이렇게 파라미터 넣음
  // 로그인 됐을 경우
  // if(action && action.payload)
  //   yield call(updateProfileWhenActivated , action.payload)
  // if (Notification.permission === "granted")
  //   yield call(createUserDevice);
  // else 
  //   yield call(activateMessaging); // functions 호출 등을 위해 registration 등록을 해야하기 때문에 
  yield put({type:SET_BUTTON_DISABLE})

  yield call(subscribeFriendList);

  yield put({type:SET_BUTTON_ENABLE})
}
function* signOutSaga(action:ReturnType<typeof signOutAction>){
  yield put({type:SET_BUTTON_DISABLE})

  yield call(signOutCalled) // subscribe 에서 signoutcall 됐는지 확인을 위해 호출
  if(action && action.payload)
    yield call(updateProfileWhenDeactivated , action.payload)
  yield call(unsbscribeFriends)
  yield put({type:CLEAR_FRIENDS})
  // yield call(deleteUserDevice);
  yield delay(3000)
  // yield call(signOut)
  yield put({type:SIGN_OUT_CLEAR_DATA})

  yield put({type:SET_BUTTON_ENABLE})
}

function getChatlinkSaga() {
  logger("getChatlinkSaga::" , getChatLink)
  return createAsyncSaga(getChatlinkAsyncAction, getChatLink);
  // yield createAsyncSaga(getChatlinkAsyncAction, getChatLink);
}
function getChatlinkFunctionsSaga() {
  logger("getChatlinkFunctionsSaga::" , getChatlinkFunctions)
  return createAsyncSaga(getChatlinkFunctionsAsyncAction, getChatlinkFunctions);
  // yield createAsyncSaga(getChatlinkFunctionsAsyncAction, getChatlinkFunctions);
}

// function* signInWithPopupSaga(
//   action: ReturnType<typeof signInWithPopupAsyncAction.request>
// ) {
//   try {
//     const response: SignInResult = yield call(
//       signInWithPopup
//       ,action.payload as "Google" | "Facebook"
//     );
//     if (isSignInResult(response)){
//       yield put(signInWithPopupAsyncAction.success(response));
//       const smoothyUser :SmoothyUser = response
//       yield put({type:SIGN_IN,payload:smoothyUser});
//     }else
//       throw new Error('Not valid response from signInWithPopup')
//   } catch (error) {
//     yield put(signInWithPopupAsyncAction.failure(error));
//   }
// }