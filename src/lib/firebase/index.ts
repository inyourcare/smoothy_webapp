import firebase from "firebase/app";
import "firebase/auth"; // for authentication
import "firebase/storage"; // for storage
import "firebase/database"; // for realtime database
import "firebase/firestore"; // for cloud firestore
import "firebase/messaging"; // for cloud messaging
import "firebase/functions"; // for cloud functions
import firebaseConfig from "../../config/firebase";
import logger from "../custom-logger/logger";

export * from "./auth";
export * from "./firestore";
export * from "./functions";
export * from "./subscribe";
export * from "./types";
export * from "./messaging";

export const firebaseApp = () => firebase.app();
export const firebaseAuth = () => firebase.auth();
export const firebaseStorage = () => firebase.storage();
export const firebaseDatabase = () => firebase.database();
export const firebaseFirestore = () => firebase.firestore();
export const firebaseMessaging = () => firebase.messaging();
export const firebaseFunctions = () => firebase.functions();

export function initializeFirebase() {
  logger("start initialize firebase");
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    logger("firebase initialized", firebase.apps.length);
  }
}


