import * as action from './actions';
import { ActionType } from 'typesafe-actions';
import { AsyncState } from '../../lib/util/reducerUtils';
import { Friend, FullscreenEffect, GetChatLinkResultWithProfile, PartyMember, SignInResult } from '../../lib/firebase';

export type FirebaseAction = ActionType<typeof action>;
export type FirebaseState = {
  signedInUser: AsyncState<SignInResult,Error> ,
  // signOutState:  AsyncState<void,Error> ,
  getChatlinkState:  AsyncState<GetChatLinkResultWithProfile,Error>
  partyMembers:  Map<string, PartyMember>,
  // partyMembers:  Array<PartyMember>,
  friends:  Map<string, Friend>,
  // friends:  {[key:string]:Friend},
  // friends:  Array<Friend>,
  user: SmoothyUser|null,
  fullscreenEffect: Array<FullscreenEffect>,
  firebaseProfile:firebase.default.UserInfo|null
};

export type SmoothyUser = {
  nickname:string,key:string,username:string
}