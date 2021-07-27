import firebase from "firebase";
import { firebaseStorage } from ".";
import { getCurrentUser } from "./auth";
import { getServerTime } from "./firestore";

export async function uploadProfileImage(img: File, callback?:Function) {
  // const s = firebase.database.ServerValue.TIMESTAMP // 1591852339492.jpg
  const uid = getCurrentUser()?.uid;
  if (uid) {
    const timestamp = await getServerTime(); // 1591852339492.jpg
    const fileName = `${timestamp}.jpg`;
    const imgStorageRef = firebaseStorage()
      .ref()
      .child(`user/${uid}/${fileName}`)
      // .child(uid)
      // .child(fileName);

    // Create file metadata including the content type
    var metadata = {
      contentType: "image/jpeg",
    };

    // Upload the file and metadata
    var uploadTask = imgStorageRef.put(img, metadata);
    // const dispatch = store.dispatch
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function (error) {
        // Handle unsuccessful uploads
        // dispatch({type:SET_PROFILE_IMAGE_URL,payload:"error"})
        console.error("[uploadProfileImage] uploading failed", error);
        if (typeof callback === 'function')
            callback()
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          if (typeof callback === 'function')
            callback()
          // dispatch({type:SET_PROFILE_IMAGE_URL,payload:downloadURL})
        });
      }
    );
  }
}
