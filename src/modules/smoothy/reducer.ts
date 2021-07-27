import { createReducer } from "typesafe-actions";
import { activateEachScreenHammerMode , clearToBeUserAction, deactivateEachScreenHammerMode, setToBeUserAction , loadDoneToBeUserAction, setFCMMessageAction, clearFCMMessageAction, setTwilioVideochatPropsAction, clearTwilioVideochatPropsAction, setRoomConnectedAction, clearRoomConnectedAction, setPlaybackAction, clearPlaybackAction, setPlaylistAction, clearPlaylistAction, attachPingListAction, clearPingListAction, setSelectedVideoAction, clearSelectedVideoAction, setButtonDisableAction, setButtonEnableAction, setYoutubeDivWidthHeightAction, setVideochatUserProfilesAction, setMyProfileAction, setAlertSnackbarAction } from "./actions";
import {SmoothyAction , SmoothyState, ToBeUser} from './types'

const initialState: SmoothyState = {
  eachscreen:{
    hammer:false
  },
  // youtubeMode:false,
  youtube:{
    sharedVideoPlayback: null,
    playlist: null,
    selectedVideo: null
  },
  toBeUser:null,
  fcmMessage:[],
  twilioVideoChatProps:null,
  roomConnected:null,
  pingListMap:new Map(),
  buttonDisable:false,
  youtubeVideoDivWidthHeight:{width:0,height:0},
  videoChatUserProfiles:new Map(),
  myProfile:null,
  alertSnackbar:null
};
const smoothy = createReducer<SmoothyState, SmoothyAction>(initialState)
.handleAction(activateEachScreenHammerMode,(state)=>{
  return {...state,eachscreen:{...state.eachscreen,hammer:true}}
})
.handleAction(deactivateEachScreenHammerMode,(state)=>{
  return {...state,eachscreen:{...state.eachscreen,hammer:false}}
})
.handleAction(setToBeUserAction,(state,action)=>{
  return {...state,toBeUser:action.payload}
})
.handleAction(clearToBeUserAction,(state)=>{
  return {...state,toBeUser:null}
})
.handleAction(loadDoneToBeUserAction,(state)=>{
  return {...state,toBeUser:{...state.toBeUser,loading:false} as ToBeUser}
})
.handleAction(setFCMMessageAction,(state,action)=>{
  return {...state,fcmMessage:state.fcmMessage.concat(action.payload)}
})
.handleAction(clearFCMMessageAction,(state)=>{
  return {...state,fcmMessage:[]}
})
.handleAction(setTwilioVideochatPropsAction,(state,action)=>{
  return {...state,twilioVideoChatProps:action.payload}
})
.handleAction(clearTwilioVideochatPropsAction,(state)=>{
  return {...state,twilioVideoChatProps:null}
})
.handleAction(setRoomConnectedAction,(state,action)=>{
  return {...state,roomConnected:action.payload}
})
.handleAction(clearRoomConnectedAction,(state)=>{
  return {...state,roomConnected:null}
})
// .handleAction(activateYoutubeAction,(state)=>{
//   return {...state,youtubeMode:true}
// })
// .handleAction(deactivateYoutubeAction,(state)=>{
//   return {...state,youtubeMode:false}
// })
// youtube
.handleAction(setPlaybackAction,(state,action)=>{
  return {...state,youtube:{
    ...state.youtube,
    sharedVideoPlayback:action.payload
  }}
})
.handleAction(clearPlaybackAction,(state)=>{
  return {...state,youtube:{
    ...state.youtube,
    sharedVideoPlayback:null
  }}
})
.handleAction(setPlaylistAction,(state,action)=>{
  return {...state,youtube:{
    ...state.youtube,
    playlist:action.payload
  }}
})
.handleAction(clearPlaylistAction,(state)=>{
  return {...state,youtube:{
    ...state.youtube,
    playlist:null
  }}
})
// ping list
.handleAction(attachPingListAction,(state,action)=>{
  const payload = action.payload
  const pingCheckState = {
    uid: payload.uid,
    come: payload.come,
    sent: payload.sent
  }
  const pingListMap = state.pingListMap
  if (pingListMap.has(payload.partyNo)){
    const list = pingListMap.get(payload.partyNo)
    const filtered = list?.filter(prevState=>prevState.uid===payload.uid)
    filtered?filtered.forEach(newState=>{
      newState.come = payload.sent===true?true:false
      newState.come = payload.come===true?true:false
    }):list?.concat(pingCheckState)
  }else{
    pingListMap.set(payload.partyNo,[pingCheckState])
  }
  // pingListMap.set("rerender" , [])
  return {...state}
})
.handleAction(clearPingListAction,(state,action)=>{
  const partyNo = action.payload
  const pingListMap = state.pingListMap
  if (pingListMap.has(partyNo)){
    pingListMap.delete(partyNo)
  }
  return state
})
.handleAction(setSelectedVideoAction,(state,action)=>{
  return {...state,youtube:{
    ...state.youtube,
    selectedVideo:action.payload
  }}
})
.handleAction(clearSelectedVideoAction,(state)=>{
  return {...state,youtube:{
    ...state.youtube,
    selectedVideo:null
  }}
})
// button diable
.handleAction(setButtonDisableAction,(state)=>{
  return {...state,buttonDisable:true}
})
.handleAction(setButtonEnableAction,(state,action)=>{
  return {...state,buttonDisable:false}
})
.handleAction(setYoutubeDivWidthHeightAction,(state,action)=>{
  return {...state,youtubeVideoDivWidthHeight:action.payload}
})
.handleAction(setVideochatUserProfilesAction,(state,action)=>{
  return {...state,videoChatUserProfiles:new Map(action.payload)}
})
.handleAction(setMyProfileAction,(state,action)=>{
  return {...state,myProfile:action.payload}
})
.handleAction(setAlertSnackbarAction,(state,action)=>{
  return {...state,alertSnackbar:action.payload}
})

export default smoothy;