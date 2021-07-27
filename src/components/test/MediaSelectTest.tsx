import React, { useEffect } from "react";
import logger from "../../lib/custom-logger/logger";

function MediaSelectTest() {
  const defaultEffect = useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement;
    const button = document.getElementById("button") as HTMLButtonElement;
    const select = document.getElementById("select") as HTMLSelectElement;
    button.addEventListener("click", (event) => {
      const constraints = {
        video: true,
        audio: false,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          // video.srcObject = stream;
          var videoTracks = stream.getVideoTracks();
          console.log('[getUserMedia] Got stream with constraints:', constraints);
          console.log('[getUserMedia]Using  video device: ' + videoTracks[0].label);
          // stream.onended = function() {
          stream.onremovetrack = function() {
            console.log('[getUserMedia] Stream ended');
          };
          // window.stream = stream; // make variable available to console
          video.srcObject = stream;
          video.play()
        })
        .catch((error) => {
          // 미디어가 안된다는거는 여기서 해결해야한다.
          console.error('[getUserMedia] ' + error);
        });
    });
    function gotDevices(mediaDevices: MediaDeviceInfo[]) {
      select.innerHTML = "";
      select.appendChild(document.createElement("option"));
      let count = 1;
      logger("[gotDevices] mediaDevices::" , mediaDevices)
      mediaDevices.forEach((mediaDevice) => {
        if (mediaDevice.kind === "videoinput") {
          const option = document.createElement("option");
          option.value = mediaDevice.deviceId;
          const label = mediaDevice.label || `Camera ${count++}`;
          const textNode = document.createTextNode(label);
          option.appendChild(textNode);
          select.appendChild(option);
          
        }
      });
    }
    navigator.mediaDevices.enumerateDevices().then(gotDevices)
  }, []);
  return (
    <>
      <video id="video" />
      <button id="button" >button</button>
      <select id="select" />
    </>
  );
}

export default MediaSelectTest;
