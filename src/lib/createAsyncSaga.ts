import { call, put } from "@redux-saga/core/effects";
import { AsyncActionCreatorBuilder, PayloadAction } from "typesafe-actions";
import { SET_BUTTON_DISABLE, SET_BUTTON_ENABLE } from "../modules/smoothy";

type PromiseCreatorFunction<P, T> =
  | ((payload: P) => Promise<T>)
  | (() => Promise<T>);

function isPayloadAction<P>(action: any): action is PayloadAction<string, P> {
  return action.payload !== undefined;
}

export default function createAsyncSaga<P1, P2, P3>(
  asyncActionCreator: AsyncActionCreatorBuilder<
    [string, [P1, undefined]],
    [string, [P2, undefined]],
    [string, [P3, undefined]]
  >,
  promiseCreator: PromiseCreatorFunction<P1, P2>
) {
  return function* saga(action: ReturnType<typeof asyncActionCreator.request>) {
    yield put({type:SET_BUTTON_DISABLE})
    try {
      const response: P2 = isPayloadAction<P1>(action) // payload 존재여부 확인
        ? yield call(promiseCreator, action.payload)
        : yield call(promiseCreator);
      yield put(asyncActionCreator.success(response));
    } catch (e) {
      yield put(asyncActionCreator.failure(e as any));
    }
    yield put({type:SET_BUTTON_ENABLE})
  };
}
