import { Dispatch } from "react";
import { firebaseAuth, firebaseFirestore } from ".";
import { SIGN_IN, SmoothyUser } from "../../modules/firebase";
import {
  AlertSeverityProvider,
  CLEAR_TO_BE_USER,
  LOAD_DONE_TO_BE_USER,
  SET_ALERT_SNACKBAR,
  SET_TO_BE_USER,
} from "../../modules/smoothy";
import constants from "../common/constants";
import logger, { errorLogger } from "../custom-logger/logger";
import { checkAndUpdateUserOnline, updateUserBackToOffline } from "./firestore";
import { AuthProviders } from "./types";
import { v1 as uuidV1 } from "uuid";

// session 관리
export var sessionId: string | null;

export function authTest() {
  logger("authTest", getCurrentUser()?.providerData);
}
export function signInWithPopup(
  providerName: "Google" | "Facebook",
  dispatch: Dispatch<any>
) {
  logger("signInWithPopup");
  // You can add additional scopes to the provider:
  // provider.addScope("email");
  // provider.addScope("user_friends");
  return firebaseAuth()
    .signInWithPopup(AuthProviders[providerName])
    .then(
      function (result) {
        var credential = result.credential;
        dispatch({
          type: SET_TO_BE_USER,
          payload: {
            nickname: result.user?.displayName,
            key: result.user?.uid,
            username: null,
            photoURL: result.user?.photoURL,
            loading: true,
            credential,
          },
        });
        // credential signin 으로 우리 앱 유저인지 판별
        if (credential) {
          // return signInWithCredential(credential , dispatch);
          return signInWithCredential(credential, providerName);
        } else {
          throw new Error("credential must not null");
        }
      },
      function (error) {
        // var email = error.email;
        // if (error.code === "auth/account-exists-with-different-credential") {
        //   firebaseAuth().fetchSignInMethodsForEmail(email).then(function (providers) {
        //     throw new Error("available with other providers: " + providers);
        //   });
        // }
        if (error.code === "auth/popup-closed-by-user") return null;
        // logger('sign in err' , error)
        if (providerName === "Facebook") {
          errorLogger({
            id: `${constants.smoothy.error.login_failed_facebook_credential_error.id}`,
            msg: `${constants.smoothy.error.login_failed_facebook_credential_error.msg}`,
            error,
          });
        } else
          errorLogger({
            id: `${constants.smoothy.error.login_failed_google_credential_error.id}`,
            msg: `${constants.smoothy.error.login_failed_google_credential_error.msg}`,
            error,
          });
        return null;
      }
    );
}

export function signOut() {
  logger("signOut");
  return firebaseAuth()
    .signOut()
    .then(
      function (result) {
        logger("signOut after");
        return;
      },
      function (error) {
        throw new Error(error);
      }
    );
}

export async function getCurrentUserData(userUid: string) {
  logger("getCurrentUserData", userUid);
  return await firebaseFirestore()
    .collection("profiles")
    .doc(userUid)
    .get()
    .then(function (result) {
      return result.data();
    })
    .catch(function (error) {
      errorLogger({
        id: `${constants.smoothy.error.username_failed_get_profile_failure.id}`,
        msg: `${constants.smoothy.error.username_failed_get_profile_failure.msg}`,
        error,
      });
      throw Error(error);
    });
}

export function getCurrentUser() {
  logger("getCurrentUser");
  return firebaseAuth().currentUser;
}

export async function signInWithCredential(
  credential: firebase.default.auth.AuthCredential,
  // dispatch: Dispatch<any>
  providerName?: string
) {
  logger("[signInWithCredential] signInWithCredential");
  return firebaseAuth()
    .signInWithCredential(credential)
    .then(async function (result) {
      // const dbProfile = ((await getCurrentUserData(
      //   result.user?.uid as string
      // )) as unknown) as SignInResult;
      // logger('[signInWithCredential] credential sign-in success::' , dbProfile)
      logger("[signInWithCredential] credential sign-in success", result);
      // if (dbProfile && dbProfile.username) {
      //   logger('[signInWithCredential] smoothy db profile loaded well' , dbProfile)
      //   dispatch({type:CLEAR_TO_BE_USER})
      //   return dbProfile;
      // } else {
      //   logger('[signInWithCredential] smoothy db profile has a problem' , dbProfile)
      //   dispatch({type:LOAD_DONE_TO_BE_USER})
      //   return null;
      //   // if (dbProfile.webOnline === true){
      //   //   console.error('[signInWithCredential] sign in with multiple browsers not allowed')
      //   //   return null;
      //   // }else {
      //   //   dispatch({type:LOAD_DONE_TO_BE_USER})
      //   //   return null;
      //   // }
      // }
      return true;
    })
    .catch(function (error) {
      if (providerName && providerName === "Facebook") {
        errorLogger({
          id: `${constants.smoothy.error.login_failed_facebook_firebase_auth_creation_error.id}`,
          msg: `${constants.smoothy.error.login_failed_facebook_firebase_auth_creation_error.msg}`,
          error,
        });
      } else if (providerName && providerName === "Google")
        errorLogger({
          id: `${constants.smoothy.error.login_failed_google_firebase_auth_creation_error.id}`,
          msg: `${constants.smoothy.error.login_failed_google_firebase_auth_creation_error.msg}`,
          error,
        });
      else
        errorLogger({
          id: `${constants.smoothy.error.login_failed_firebase_auth_creation_error.id}`,
          msg: `${constants.smoothy.error.login_failed_firebase_auth_creation_error.msg}`,
          error,
        });
      throw new Error(error);
    });
}

export async function signInSmoothyUser(uid: String, dispatch: Dispatch<any>) {
  sessionId = uuidV1();
  checkAndUpdateUserOnline(String(uid))
    .then(function (data) {
      // const dbProfile = await getCurrentUserData(uid as string)
      getCurrentUserData(uid as string)
        .then((dbProfile) => {
          logger("[signInSmoothyUser] profile loaded", dbProfile);

          if (dbProfile && !dbProfile.online && dbProfile.username) {
            logger("[onAuthStateChanged] user signed in", uid);
            const smoothyUser: SmoothyUser = dbProfile as SmoothyUser;
            // uid = smoothyUser.key
            dispatch({ type: SIGN_IN, payload: smoothyUser });
            dispatch({ type: CLEAR_TO_BE_USER });
          } else {
            // dispatch({type:SET_SIGN_IN_USER,payload:null})
            updateUserBackToOffline(String(uid));
            console.error("[onAuthStateChanged] sign in failed::", dbProfile);
            if (dbProfile && dbProfile.online) {
              dispatch({ type: CLEAR_TO_BE_USER });
              signOut();
            } else {
              dispatch({ type: LOAD_DONE_TO_BE_USER });
            }
            // uid = null;
          }
        })
        .catch((err) => {
          console.error("[signInSmoothyUser] getCurrentUserData err::", err);
          signOut();
        });
    })
    .catch(function (err) {
      // alert('중복 로그인입니다. 브라우저 사용은 하나의 텝에서만 가능합니다.')
      if (err) {
        // alert(err);
        dispatch({
          type: SET_ALERT_SNACKBAR,
          payload: {
            severity: AlertSeverityProvider.error,
            alertMessage: err,
          },
        });
      }
      console.error("[signInSmoothyUser] checkAndUpdateUserOnline err::", err);
      signOut();
    });
}
