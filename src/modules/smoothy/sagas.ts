// import { getChatLink, SignInResult, signInWithPopup, signOut , isSignInResult} from "../../lib/firebase";
// import {
//   CLEAR_SIGNED_IN_DATA,
//   // getChatlinkAsyncAction,
//   // GET_CHATLINK ,
//   signInWithPopupAsyncAction,
//   signOutAsyncAction,
//   SIGN_IN_WITH_POPUP,
//   SIGN_OUT,
//   SIGN_OUT_SUCCESS,
// } from "./actions";
// import { call, put, takeEvery } from "redux-saga/effects";
// import createAsyncSaga from "../../lib/createAsyncSaga";

// // const signInSaga = createAsyncSaga(signInWithPopupAsyncAction, signInWithPopup);
// const signOutSaga = createAsyncSaga(signOutAsyncAction, signOut);
// const signOutSuccessSaga = function* () {
//   yield put({ type: CLEAR_SIGNED_IN_DATA });
// };
// // const getChatlinkSaga = createAsyncSaga(getChatlinkAsyncAction, getChatLink);

// export function* firebaseSaga() {
//   yield takeEvery(SIGN_IN_WITH_POPUP, signInWithPopupSaga);
//   yield takeEvery(SIGN_OUT, signOutSaga);
//   yield takeEvery(SIGN_OUT_SUCCESS, signOutSuccessSaga);
//   // yield takeEvery(GET_CHATLINK, getChatlinkSaga);
// }


// function* signInWithPopupSaga(
//   action: ReturnType<typeof signInWithPopupAsyncAction.request>
// ) {
//   try {
//     const response: SignInResult = yield call(
//       signInWithPopup
//       ,action.payload as "Google" | "Facebook"
//     );
//     if (isSignInResult(response))
//       yield put(signInWithPopupAsyncAction.success(response));
//     else
//       throw new Error('Not valid response from signInWithPopup')
//   } catch (error) {
//     yield put(signInWithPopupAsyncAction.failure(error));
//   }
// }

export const sagas = {};