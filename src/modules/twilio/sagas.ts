import {
  ATTACH_REMOTE_TRACKS,
  connectToARoomAsyncAction,
  CONNECT_TO_A_ROOM,
  CONNECT_TO_A_ROOM_SUCCESS,
} from "./actions";
import { put, takeEvery } from "redux-saga/effects";
import createAsyncSaga from "../../lib/createAsyncSaga";
import { connectToARoom } from "../../lib/twilio";
import { SET_BUTTON_DISABLE, SET_BUTTON_ENABLE } from "../smoothy";

const connectToARoomSaga = createAsyncSaga(
  connectToARoomAsyncAction,
  connectToARoom
);

const attatchTracksSaga = function* () {
  yield put({type:SET_BUTTON_DISABLE})
  yield put({ type: ATTACH_REMOTE_TRACKS });
  yield put({type:SET_BUTTON_ENABLE})
};

export function* twilioSaga() {
  yield takeEvery(CONNECT_TO_A_ROOM, connectToARoomSaga);
  yield takeEvery(CONNECT_TO_A_ROOM_SUCCESS, attatchTracksSaga);
}
