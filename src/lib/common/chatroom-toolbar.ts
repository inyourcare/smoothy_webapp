import { Room } from "twilio-video";
import { store } from "../..";
import {
  CLEAR_ROOM_CONNECTED,
  CLEAR_TWILIO_VIDEOCHAT_PROPS,
} from "../../modules/smoothy";
import { defaultOnBeforeUnload } from "./common";
import { preprocessToDisconnect } from "./twilio-video-chat";
import * as H from "history";
import { disconnectToARoom } from "../twilio";

type disconnectARoomProps = {
  partyNo: string | null | undefined;
  roomConnected: Room | null;
  setOnBeforeUnload: React.Dispatch<
    React.SetStateAction<(event: Event) => void>
  >;
  history: H.History<unknown>;
};
export function commonDisconnectARoom({
  partyNo,
  roomConnected,
  setOnBeforeUnload,
  history,
}: disconnectARoomProps) {
  const dispatch = store.dispatch;
  if (partyNo) {
    preprocessToDisconnect(partyNo, dispatch);
  }
  if (roomConnected) {
    // roomConnected.disconnect();
    disconnectToARoom(roomConnected)
    dispatch({ type: CLEAR_TWILIO_VIDEOCHAT_PROPS });
    dispatch({ type: CLEAR_ROOM_CONNECTED });
  }

  // onBeforeUnload set
  // disconnect 하면서 기존의 onBeforeUnload 로 바꿔줘야함
  setOnBeforeUnload(defaultOnBeforeUnload);
  history.push("/");
}
