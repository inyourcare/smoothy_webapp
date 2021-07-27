import { firebaseMessaging } from ".";
import logger from "../custom-logger/logger";
import firebaseConfig from "../../config/firebase";
import { MessagingPayload } from "./types";
import {store} from '../../index'
import { SET_FCM_MESSAGE } from "../../modules/smoothy";

let fcmToken:string

export function fcmTestMessaging() {
  logger("fcmTestMessaging");
  const messaging = firebaseMessaging();
  // Add the public key generated from the console here.
  messaging
    .getToken({ vapidKey: firebaseConfig.vapIdKey })
    .then(function (currentToken) {
      logger("getToken", currentToken);
    })
    .catch(function (error) {
      logger("error", error);
      throw new Error(error);
    });
}

export function getFcmToken(){
  return fcmToken
}

export async function activateMessaging() {
  logger("[activateMessaging]");
  const messaging = firebaseMessaging();
  
  return navigator.serviceWorker.getRegistration("/firebase-cloud-messaging-push-scope")
  // return navigator.serviceWorker
  // .register(`/firebase-messaging-sw-${process.env.REACT_APP_MODE}.js`, {
  //   scope: "/firebase-cloud-messaging-push-scope",
  // })
    .then(async (registration) => {
      logger("[activateMessaging] params", registration);
      // logger("[activateMessaging] params", registration , firebaseConfig.vapIdKey);

      if (Notification.permission === "granted"){
        return messaging
          .getToken({
            vapidKey: firebaseConfig.vapIdKey,
            serviceWorkerRegistration: registration,
          })
          .then(function (currentToken) {
            logger("[activateMessaging] currentToken", currentToken);
            // doFuncWhenGranted(onMessageAction)
            onMessageAction()
            fcmToken = currentToken;
            return currentToken;
          })
          .catch(function (error) {
            console.error("[activateMessaging] error", error);
          });
      } else {
        logger("[activateMessaging] notification no granted")
        return null
      }
    });
}

// // foreground
// export function activateOnMessage() {
//   logger("activateOnMessage");
//   // doFuncWhenGranted(onMessageAction)
//   onMessageAction()
// }


function onMessageAction() {
  logger("[onMessageAction] granted notification permission", Notification.permission);
  firebaseMessaging().onMessage((payload) => {
    console.log("Message received. ", payload);
    store.dispatch({type:SET_FCM_MESSAGE , payload:payload.data as MessagingPayload})
  });
}

// background
export function activeBackgroundOnMessage(payload: MessagingPayload) {
  console.log(
    "2.[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  navigator.serviceWorker.getRegistration().then(function (registration) {
    registration?.showNotification(notificationTitle, notificationOptions);
  });
}
