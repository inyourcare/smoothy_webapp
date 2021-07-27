import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { appendFullscreenReaction } from "../../lib/common/common";
import constants from "../../lib/common/constants";
import logger from "../../lib/custom-logger/logger";
import { TEST_ACTIVATE_YOUTUBE, TEST_DEACTIVATE_YOUTUBE } from "../../modules/test";
// import constantsTest from "./constants";

const EffectButtonSpaceStyle = styled.div`
  .effect-space {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index:  ${constants.smoothy.zidx.btn};
    /* display: none; */
  }
  .ative-effect-btn {
    background-color: yellowgreen;
  }
`;

let wiggleTimer: NodeJS.Timeout;
type EffectButtonSpaceProps = {
  fullscreenConstainerDivElem: () => HTMLDivElement;
  activeEachScreenHammerMode: () => void;
  deactiveEachScreenHammerMode: () => void;
  eachScreenHammerMode: boolean;
  youtubeMode: boolean
};
function EffectButtonSpaceForTest({
  fullscreenConstainerDivElem,
  activeEachScreenHammerMode,
  deactiveEachScreenHammerMode,
  eachScreenHammerMode,
  youtubeMode
}: EffectButtonSpaceProps) {
  const [activeEffect, setActiveEffect] = useState(false);
  const dispatch = useDispatch()

  const fullscreenEffectOnClick = (e: React.MouseEvent, effectName: string) => {
    // appendFullscreenReaction(effectName, parent() as Element);
    if (effectName === "011_fullscreen_shakeshake") {
      // parent()?.classList.add('wiggle')
      // setTimeout(() => parent()?.classList.remove('wiggle'), 1650);
      // fullscreenConstainerDivElem().style.animation = ""
      setTimeout(function () {
        // fullscreenConstainerDivElem().style.animation = "wiggle 1.65s infinite"
        fullscreenConstainerDivElem().classList.add(constants.animation.wiggle);
        clearTimeout(wiggleTimer);
        wiggleTimer = setTimeout(() => {
          // fullscreenConstainerDivElem().style.animation = ""
          fullscreenConstainerDivElem().classList.remove(constants.animation.wiggle);
        }, 1650);
      }, 100);
    } else if (effectName === constants.reaction.eachscreen.hammer.img) {
      // const mode = constantsTest.videoChat.mode.eachScreenAndHammerMode
      // if (fullscreenConstainerDivElem().classList.contains(mode)){
      if (eachScreenHammerMode === false) {
        // fullscreenConstainerDivElem().classList.remove(mode)
        activeEachScreenHammerMode();
      } else {
        // fullscreenConstainerDivElem().classList.add(mode)
        deactiveEachScreenHammerMode();
      }
    } else {
      appendFullscreenReaction(
        effectName,
        fullscreenConstainerDivElem() as Element
      );
    }
  };
  const activeEffectClick = () => {
    setActiveEffect(!activeEffect);
  };
  // const fcmTest = useCallback(() => {
  //   // alert("fcm test");
  //   fcmTestMessaging();
  // }, []);
  const testFunctionCall = useCallback(()=>{
    // testDoubleCall()
    // getYoutubeVideoInfo("0ovJg6xN1N8");
    // addDeviceIdToTriggerForDelete({userId:'testuser' , deviceId:'device'})
    // deleteFirestoreTest()
    // getChatlinkFunctions("").then(function(data){
    //   console.log("getChatlinkFunctions",data)
    // })

    // const constraints = {
    //   video: false,
    //   audio: true
    // };
    // navigator.mediaDevices
    //   .getUserMedia(constraints)
    //   .then(stream => {
    //     logger(stream)
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    navigator.mediaDevices.enumerateDevices().then((mediaDevices=>{
      mediaDevices.forEach(mediaDevice=>{
        logger(mediaDevice)
        // if (mediaDevice.kind === 'videoinput') {
        //   const option = document.createElement('option');
        //   option.value = mediaDevice.deviceId;
        //   const label = mediaDevice.label || `Camera ${count++}`;
        //   const textNode = document.createTextNode(label);
        //   option.appendChild(textNode);
        //   select.appendChild(option);
        // }
      })
    }))
  },[])

  // const functionsOnrequest = useCallback(()=>{
  //   deleteUserDeviceIdAxios()
  // },[])
  const toggleYoutubeMode = useCallback(() => {
    if(youtubeMode === true)
      dispatch({type:TEST_DEACTIVATE_YOUTUBE})
    else
      dispatch({type:TEST_ACTIVATE_YOUTUBE})
  },[dispatch, youtubeMode])
  return (
    <>
      <EffectButtonSpaceStyle>
        <div className="effect-space">
          <button className="ative-effect-btn" onClick={activeEffectClick}>
            active effect
          </button>
          {/* <button className="ative-effect-btn" onClick={test}>test!</button> */}
          {activeEffect === true && (
            <div>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "009_fullscreen_thundervolt")
                }
              >
                009_fullscreen_thundervolt
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "010_fullscreen_lovelove")
                }
              >
                010_fullscreen_lovelove
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "011_fullscreen_shakeshake")
                }
              >
                011_fullscreen_shakeshake
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, constants.reaction.eachscreen.hammer.img)
                }
              >
                {constants.reaction.eachscreen.hammer.img}
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "013_fullscreen_confettie")
                }
              >
                013_fullscreen_confettie
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "014_fullscreen_starbomb")
                }
              >
                014_fullscreen_starbomb
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "015_fullscreen_flowerrain")
                }
              >
                015_fullscreen_flowerrain
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "016_fullscreen_kkkk")
                }
              >
                016_fullscreen_kkkk
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "017_fullscreen_gloomyrain")
                }
              >
                017_fullscreen_gloomyrain
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "023_fullscreen_halloweenweb")
                }
              >
                023_fullscreen_halloweenweb
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "024_fullscreen_snow")
                }
              >
                024_fullscreen_snow
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "025_fullscreen_fireworks")
                }
              >
                025_fullscreen_fireworks
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "030_fullscreen_goldconfetti")
                }
              >
                030_fullscreen_goldconfetti
              </button>
              <button
                className="btn"
                onClick={(e) =>
                  fullscreenEffectOnClick(e, "031_fullscreen_realmoneyrain")
                }
              >
                031_fullscreen_realmoneyrain
              </button>
              <button className="btn" onClick={(e) => testFunctionCall()}>
              {/* <button className="btn" onClick={(e) => getYoutubePlaybackCall()}> */}
              {/* <button className="btn" onClick={(e) => {getServerTime().then(function(data){logger("result =>",data)})}}> */}
              {/* <button className="btn" onClick={async (e) => {logger("result =>",await getServerTime())}}> */}
                function test
              </button>
              <button className="btn" onClick={(e) => toggleYoutubeMode()}>
                youtube
              </button>
            </div>
          )}
        </div>
      </EffectButtonSpaceStyle>
    </>
  );
}

export default EffectButtonSpaceForTest;
