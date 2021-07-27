import {createAction, createReducer } from "typesafe-actions";



export const TEST_ACTIVATE_EACH_SCREEN_HAMMER_MODE = "test/TEST_ACTIVATE_EACH_SCREEN_HAMMER_MODE";
export const TEST_DEACTIVATE_EACH_SCREEN_HAMMER_MODE = "test/TEST_DEACTIVATE_EACH_SCREEN_HAMMER_MODE";
export const testActivateEachScreenHammerMode = createAction(TEST_ACTIVATE_EACH_SCREEN_HAMMER_MODE)();
export const testDeactivateEachScreenHammerMode = createAction(TEST_DEACTIVATE_EACH_SCREEN_HAMMER_MODE)();

export const TEST_ACTIVATE_YOUTUBE = "test/TEST_ACTIVATE_YOUTUBE";
export const TEST_DEACTIVATE_YOUTUBE = "test/TEST_DEACTIVATE_YOUTUBE";
export const testActivateYoutubeAction = createAction(TEST_ACTIVATE_YOUTUBE)();
export const testDeactivateYoutubeAction = createAction(TEST_DEACTIVATE_YOUTUBE)();

export const TEST_ACTIVATE_YOUTUBE_POPUP = "test/TEST_ACTIVATE_YOUTUBE_POPUP";
export const TEST_DEACTIVATE_YOUTUBE_POPUP = "test/TEST_DEACTIVATE_YOUTUBE_POPUP";
export const testActivateYoutubePopupAction = createAction(TEST_ACTIVATE_YOUTUBE_POPUP)();
export const testDeactivateYoutubePopupAction = createAction(TEST_DEACTIVATE_YOUTUBE_POPUP)();

export const TEST_ACTIVATE_TEST_MODE = "test/TEST_ACTIVATE_TEST_MODE";
export const TEST_DEACTIVATE_TEST_MODE = "test/TEST_DEACTIVATE_TEST_MODE";
export const testActivateTestModeAction = createAction(TEST_ACTIVATE_TEST_MODE)();
export const testDeactivateTestModeAction = createAction(TEST_DEACTIVATE_TEST_MODE)();

type TestAction =
  | ReturnType<typeof testActivateEachScreenHammerMode>
  | ReturnType<typeof testDeactivateEachScreenHammerMode>
  | ReturnType<typeof testActivateYoutubeAction>
  | ReturnType<typeof testDeactivateYoutubeAction>
  | ReturnType<typeof testActivateYoutubePopupAction>
  | ReturnType<typeof testDeactivateYoutubePopupAction>
  | ReturnType<typeof testActivateTestModeAction>
  | ReturnType<typeof testDeactivateTestModeAction>
export type TestState = {
  eachScreenHammerMode:boolean
  youtubeMode:boolean
  youtubePopupMode:boolean
  testMode: boolean
};

const initialState: TestState = {
  eachScreenHammerMode: false,
  youtubeMode: false,
  youtubePopupMode: false,
  testMode: false,
};

const test = createReducer<TestState, TestAction>(initialState)
.handleAction(testActivateEachScreenHammerMode,(state)=>{
  return {...state,eachScreenHammerMode:true}
})
.handleAction(testDeactivateEachScreenHammerMode,(state)=>{
  return {...state,eachScreenHammerMode:false}
})
.handleAction(testActivateYoutubeAction,(state)=>{
  return {...state,youtubeMode:true}
})
.handleAction(testDeactivateYoutubeAction,(state)=>{
  return {...state,youtubeMode:false}
})
.handleAction(testActivateYoutubePopupAction,(state)=>{
  return {...state,youtubePopupMode:true}
})
.handleAction(testDeactivateYoutubePopupAction,(state)=>{
  return {...state,youtubePopupMode:false}
})
.handleAction(testActivateTestModeAction,(state)=>{
  return {...state,testMode:true}
})
.handleAction(testDeactivateTestModeAction,(state)=>{
  return {...state,testMode:false}
})

export default test;