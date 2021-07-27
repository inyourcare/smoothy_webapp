import { createReducer } from "typesafe-actions";
import { Friend, FullscreenEffect, PartyMember } from "../../lib/firebase";
import {
  asyncState,
  createAsyncReducer,
  transformToArray,
} from "../../lib/util/reducerUtils";
import {
  setFriendsAction,
  addPartyMemberAction,
  clearChatlinDataAction,
  clearFriendsAction,
  clearParyMembersAction,
  getChatlinkAsyncAction,
  modifyPartyMemberAction,
  removePartyMemberAction,
  setSignInUserAction,
  signInWithPopupAsyncAction,
  signOutClearDataAction,
  addFullscreenEffectAction,
  clearFullscreenEffectAction,
  getChatlinkFunctionsAsyncAction,
  setFirebaseProfileAction,
} from "./actions";
import { FirebaseState, FirebaseAction } from "./types";

const initialState: FirebaseState = {
  signedInUser: asyncState.initial(null),
  // signOutState: asyncState.initial(null),
  getChatlinkState: asyncState.initial(null),
  partyMembers: new Map<string, PartyMember>(),
  friends: new Map<string, Friend>(),
  user:null,
  fullscreenEffect: new Array<FullscreenEffect>(),
  firebaseProfile: null
};
const firebase = createReducer<FirebaseState, FirebaseAction>(initialState)
  .handleAction(
    transformToArray(signInWithPopupAsyncAction),
    createAsyncReducer(signInWithPopupAsyncAction, "signedInUser")
  )
  .handleAction(setSignInUserAction,(state,action)=>{
    return {...state,user:action.payload}
  })
  .handleAction(signOutClearDataAction, (state) => initialState)
  .handleAction(clearChatlinDataAction, (state) => {
    return {...state,getChatlinkState:asyncState.initial(null)}})
  .handleAction(
    transformToArray(getChatlinkAsyncAction),
    createAsyncReducer(getChatlinkAsyncAction, "getChatlinkState")
  )
  .handleAction(
    transformToArray(getChatlinkFunctionsAsyncAction),
    createAsyncReducer(getChatlinkFunctionsAsyncAction, "getChatlinkState")
  )
  // .handleAction(updatePartyMembersAction,(state,action)=>{
  //   return {...state,partyMembers: action.payload}
  // })
  .handleAction(addPartyMemberAction,(state,action)=>{
    return {...state,partyMembers: state.partyMembers.set(action.payload.key,action.payload)}
  })
  .handleAction(modifyPartyMemberAction,(state,action)=>{
    return {...state,partyMembers: state.partyMembers.set(action.payload.key,action.payload)}
  })
  .handleAction(removePartyMemberAction,(state,action)=>{
    state.partyMembers.delete(action.payload.key)
    return {...state}
  })
  .handleAction(clearParyMembersAction,(state)=>{
    return {...state,partyMembers:new Map<string, PartyMember>(), }
  })

  // .handleAction(addFriendAction,(state,action)=>{
  //   return {...state,friends: state.friends.set(action.payload.key,action.payload)}
  // })
  // .handleAction(modifyFriendAction,(state,action)=>{
  //   return {...state,friends: state.friends.set(action.payload.key,action.payload)}
  // })
  // .handleAction(removeFriendAction,(state,action)=>{
  //   state.friends.delete(action.payload.key)
  //   return {...state}
  // })
  .handleAction(setFriendsAction,(state,action)=>{
    return {...state,friends:action.payload}
  })
  .handleAction(clearFriendsAction,(state)=>{
    return {...state,friends:new Map<string, Friend>() }
  })
  // fullscreen effect
  .handleAction(addFullscreenEffectAction,(state,action)=>{
    if (state.fullscreenEffect.length>5)
      return state
    else
      return {...state,fullscreenEffect:state.fullscreenEffect.concat(action.payload)}
  })
  .handleAction(clearFullscreenEffectAction,(state)=>{
    return {...state,fullscreenEffect:new Array<FullscreenEffect>() }
  })
  .handleAction(setFirebaseProfileAction,(state,action)=>{
    return {...state,firebaseProfile:action.payload }
  });

export default firebase;
