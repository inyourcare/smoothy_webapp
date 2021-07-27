import * as action from "./actions";
import { ActionType } from "typesafe-actions";
// import { AsyncState } from "../../lib/reducerUtils";
// import { Room } from "twilio-video";

export type TwilioAction = ActionType<typeof action>;
export type TwilioState = {
  video_enabled: Array<String>;
  audio_enabled: Array<String>;
  actualUsers:string[];
  selectedVideoDevice:string;
  selectedAudioDevice:string;
  isTwilioChatroomstart:boolean;
};
