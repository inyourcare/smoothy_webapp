import { Dispatch } from 'redux';
// import { AsyncActionCreatorBuilder } from 'typesafe-actions';

// type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;
type AnyAsyncActionCreator = { request: any; success: any; failure: any };
type AnyPromiseCreator = (...params: any[]) => Promise<any>;

export default function createAsyncThunk<
  A extends AnyAsyncActionCreator,
  F extends AnyPromiseCreator
>(asyncActionCreator: A, promiseCreator: F) {
  type Params = Parameters<F>; // function sum (a:number, b:number) => Parameters<sum> => [number,number]
  return function thunk(...params: Params) {
    return async (dispatch: Dispatch) => {
      const { request, success, failure } = asyncActionCreator;
      dispatch(request());
      try {
        const result = await promiseCreator(...params);
        dispatch(success(result));
      } catch (error) {
        dispatch(failure(error));
      }
    };
  };
}
