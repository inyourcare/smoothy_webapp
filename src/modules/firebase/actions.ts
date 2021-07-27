import { createAction, createAsyncAction } from "typesafe-actions";
import { Friend, GetChatLinkResult, PartyMember, SignInResult ,FullscreenEffect, GetChatLinkResultWithProfile} from "../../lib/firebase";
import { SmoothyUser } from "./types";

// session
export const SIGN_IN_WITH_POPUP = "firebase/SIGN_IN_WITH_POPUP";
export const SIGN_IN_WITH_POPUP_SUCCESS = "firebase/SIGN_IN_WITH_POPUP_SUCCESS";
export const SIGN_IN_WITH_POPUP_ERROR = "firebase/SIGN_IN_WITH_POPUP_ERROR";
export const signInWithPopupAsyncAction = createAsyncAction(
  // action.type
  SIGN_IN_WITH_POPUP,
  SIGN_IN_WITH_POPUP_SUCCESS,
  SIGN_IN_WITH_POPUP_ERROR
  // result types
)<string,SignInResult,Error>();

// export const SIGN_OUT = "firebase/SIGN_OUT";
// export const SIGN_OUT_SUCCESS = "firebase/SIGN_OUT_SUCCESS";
// export const SIGN_OUT_ERROR = "firebase/SIGN_OUT_ERROR";
// export const signOutAsyncAction = createAsyncAction(
//   SIGN_OUT,
//   SIGN_OUT_SUCCESS,
//   SIGN_OUT_ERROR
// )<void,void,Error>();
export const SIGN_OUT = "firebase/SIGN_OUT";
export const signOutAction = createAction(SIGN_OUT)<string|null>();
export const SIGN_OUT_CLEAR_DATA = "firebase/SIGN_OUT_CLEAR_DATA";
export const signOutClearDataAction = createAction(SIGN_OUT_CLEAR_DATA)();

export const SIGN_IN = "firebase/SIGN_IN";
export const setSignInUserAction = createAction(SIGN_IN)<SmoothyUser>()


// functional

export const GET_CHATLINK = "firebase/GET_CHATLINK";
export const GET_CHATLINK_SUCCESS = "firebase/GET_CHATLINK_SUCCESS";
export const GET_CHATLINK_ERROR = "firebase/GET_CHATLINK_ERROR";

export const getChatlinkAsyncAction = createAsyncAction(
  GET_CHATLINK,
  GET_CHATLINK_SUCCESS,
  GET_CHATLINK_ERROR
)<string,GetChatLinkResult,Error>();

export const GET_CHATLINK_FUNCTIONS = "firebase/GET_CHATLINK_FUNCTIONS";
export const GET_CHATLINK_FUNCTIONS_SUCCESS = "firebase/GET_CHATLINK_FUNCTIONS_SUCCESS";
export const GET_CHATLINK_FUNCTIONS_ERROR = "firebase/GET_CHATLINK_FUNCTIONS_ERROR";

export const getChatlinkFunctionsAsyncAction = createAsyncAction(
  GET_CHATLINK_FUNCTIONS,
  GET_CHATLINK_FUNCTIONS_SUCCESS,
  GET_CHATLINK_FUNCTIONS_ERROR
)<string,GetChatLinkResultWithProfile,Error>();

export const CLEAR_CHATLINK_DATA = "firebase/CLEAR_CHATLINK_DATA";
export const clearChatlinDataAction = createAction(CLEAR_CHATLINK_DATA)();

// party , chatlink
export const UPDATE_PARTY_MEMBERS = "firebase/UPDATE_PARTY_MEMBERS";
export const updatePartyMembersAction = createAction(UPDATE_PARTY_MEMBERS)<Array<PartyMember>>();

// party members
export const CLEAR_PARTY_MEMBERS = "firebase/CLEAR_PARTY_MEMBERS";
export const clearParyMembersAction = createAction(CLEAR_PARTY_MEMBERS)();
export const ADD_PARTY_MEMBER = "firebase/ADD_PARTY_MEMBER";
export const addPartyMemberAction = createAction(ADD_PARTY_MEMBER)<PartyMember>();
export const MODIFY_PARTY_MEMBER = "firebase/MODIFY_PARTY_MEMBER";
export const modifyPartyMemberAction = createAction(MODIFY_PARTY_MEMBER)<PartyMember>();
export const REMOVE_PARTY_MEMBER = "firebase/REMOVE_PARTY_MEMBER";
export const removePartyMemberAction = createAction(REMOVE_PARTY_MEMBER)<PartyMember>();

// friends
export const CLEAR_FRIENDS = "firebase/CLEAR_FRIENDS";
export const clearFriendsAction = createAction(CLEAR_FRIENDS)();
export const SET_FRIENDS = "firebase/SET_FRIENDS";
export const setFriendsAction = createAction(SET_FRIENDS)<Map<string,Friend>>();

// effect
export const ADD_FULLSCREEN_EFFECT = "firebase/ADD_FULLSCREEN_EFFECT";
export const addFullscreenEffectAction = createAction(ADD_FULLSCREEN_EFFECT)<FullscreenEffect>()
export const CLEAR_FULLSCREEN_EFFECT = "firebase/CLEAR_FULLSCREEN_EFFECT";
export const clearFullscreenEffectAction = createAction(CLEAR_FULLSCREEN_EFFECT)()

// firebase profile
export const SET_FIREBASE_PROFILE = "firebase/SET_FIREBASE_PROFILE";
export const setFirebaseProfileAction = createAction(SET_FIREBASE_PROFILE)<firebase.default.UserInfo>()