import { VolumeOff } from "@material-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { appendEachScreenReaction } from "../../lib/common/common";
import constants from "../../lib/common/constants";
import logger from "../../lib/custom-logger/logger";
import { RootState } from "../../modules";
import {
  TEST_ACTIVATE_EACH_SCREEN_HAMMER_MODE,
  TEST_DEACTIVATE_EACH_SCREEN_HAMMER_MODE,
} from "../../modules/test";
import EffectButtonSpaceForTest from "./EffectButtonSpaceForTest";
import ImgWithFallback from "./ImgWithFallback";
import { Button } from "@material-ui/core";

const SmoothyVideoFrameLayoutStyle = styled.div`
  .multi-media-container {
    min-width: 480px;
    min-height: 270px;
    max-width: 100vw;
    max-height: 100vh;
    /* flex: 1 0 auto; */
    /* height: 100%; */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .img-container {
    /* flex: 1 0 auto; */
    /* height: 100%; */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  /* .img-container::before { */
  /* content:''; */
  /* padding-top:65%; */
  /* } */
  /* #multi-media-container:before { */
  /* content:''; */
  /* float:left; */
  /* padding-top:65%; */
  /* } */
  .img-div {
    /* float: left; */
    /* position: relative; */
    width: 50%;
    height: 50vh;
    overflow: hidden;
    flex-grow: 1;
    /* border: 5px solid blue; */
    box-sizing: border-box;
    position: relative;
    max-width: 640px;

    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .video {
    /* max-width: 100%; */
    min-width: 100%;
    object-fit: cover;
    /* float: left; */
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* width: 100%; */
    /* height: 100%; */
    min-height: 100%;
    /* top: 50%; */
    /* right: 50%; */
    /* transform: translateX(-50%) translateY(50%); */
    /* transform: translateX(10%); */
    /* object-position:10% 50%; */
    display: block;
  }
  .${constants.videoChat.mode.eachScreenAndHammerMode} {
    /* opacity: 0.9; */
  }
  .${constants.videoChat.mode.eachScreenAndHammerMode} .img-div:hover {
    /* opacity: 1; */
    cursor: pointer;
  }
  .img-wrapper-div {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: ${constants.smoothy.zidx.view};
  }
  #new-chat-start-btn {
    font-weight: bold;
    background-color: aliceblue;
    position: absolute;
    left: 50%;
    transform: translateX(-110%);
    bottom: 10%;
    /* z-index:  ${constants.smoothy.zidx.btn}; */
  }
`;

function SmoothyVideoFrameLayout() {
  const { eachScreenHammerMode, youtubeMode } = useSelector(
    (state: RootState) => state.test
  );
  const dispatch = useDispatch();
  const [hammerTimerMap] = useState(new Map<string, NodeJS.Timeout>());

  const getContainerElem = useCallback(
    () => document.getElementsByClassName("img-container")[0] as HTMLDivElement,
    []
  );
  // hammer effect
  const [hammerIntervalsList] = useState(new Array<number>());
  const hmmerCnt = useRef(0);
  const hammerFn = useCallback(
    (e: HTMLDivElement) => {
      var originalWidth = e.clientWidth;
      var originalHeight = e.clientHeight;
      const parent = e.parentElement as HTMLDivElement;

      let time = 0;
      let hammerOnscreen = false;
      function hammer() {
        time += 1; // 0.01 초
        if (!hammerOnscreen && time >= 10) {
          appendEachScreenReaction(
            constants.reaction.eachscreen.hammer.img,
            "hitsound",
            e
          );
          hammerOnscreen = true;
        }
        if (time >= 10) {
          if (time <= 15) {
            parent.style.opacity = "0";
          } else if (time <= 35) {
            parent.style.opacity = "1";
          }
          if (time <= 43) {
            e.style.width =
              e.clientWidth - (3 * (originalWidth / 10)) / 33 + "px";
            e.style.height =
              e.clientHeight - (3 * (originalHeight / 10)) / 33 + "px";
          } else {
            // e.style.width = e.clientWidth + ((parent.clientWidth-e.clientWidth)/57) + "px";
            // e.style.height = e.clientHeight + ((parent.clientHeight-e.clientHeight)/57) + "px";
          }
        }

        if (time >= 100) {
          window.clearInterval(intervalIdx);
        }
      }
      const intervalIdx = window.setInterval(hammer, 10);
      hammerIntervalsList.push(intervalIdx);
    },
    [hammerIntervalsList]
  );
  const divHitByHammer = useCallback(
    (e: HTMLDivElement) => {
      // appendEachScreenReaction(constants.reaction.eachscreen.hammer.img, "hitsound", e);
      // e.style.width = e.clientWidth - e.clientWidth / 10 + "px";
      // e.style.setProperty('transform', ' scaleX( 0.9)');
      // e.style.height = e.clientHeight - e.clientHeight / 10 + "px";
      const parent = e.parentElement as HTMLDivElement;
      const grandParent = parent.parentElement as HTMLDivElement;
      if (hmmerCnt.current > 0) {
        while (hammerIntervalsList.length) {
          const idx = hammerIntervalsList.pop();
          window.clearInterval(idx);
        }
        e.style.width =
          grandParent.clientWidth * Math.pow(7 / 10, hmmerCnt.current) + "px";
        e.style.height =
          grandParent.clientWidth * Math.pow(7 / 10, hmmerCnt.current) + "px";
        hmmerCnt.current++;
      }
      if (parent.style.backgroundColor === "blue")
        parent.style.backgroundColor = "green";
      else parent.style.backgroundColor = "blue";
      hammerFn(e);
    },
    [hammerFn, hammerIntervalsList]
  );
  const getBackToOriginalSize = useCallback((e: HTMLDivElement) => {
    e.style.animation = "backToOrigin 1s none";
    const parent = e.parentElement as HTMLDivElement;
    setTimeout(() => {
      e.style.width = "100%";
      e.style.height = "100%";
      e.style.animation = "";
      parent.style.backgroundColor = "";
    }, 1000);
  }, []);
  const activateEachScreenHammerMode = useCallback(() => {
    dispatch({ type: TEST_ACTIVATE_EACH_SCREEN_HAMMER_MODE });
  }, [dispatch]);
  const deactivateEachScreenHammerMode = useCallback(() => {
    dispatch({ type: TEST_DEACTIVATE_EACH_SCREEN_HAMMER_MODE });
  }, [dispatch]);

  useEffect(() => {
    // logger("eachScreenHammerMode", eachScreenHammerMode);
    if (eachScreenHammerMode === true) {
      logger("eachScreenHammerMode is true");
      getContainerElem().classList.add(
        constants.videoChat.mode.eachScreenAndHammerMode
      );
      Array.from(document.getElementsByClassName("img-wrapper-div")).forEach(
        (elem) => {
          const element = elem as HTMLDivElement;
          element.onclick = () => {
            logger("onclick", element.style.width, element.clientWidth);
            divHitByHammer(element);
            clearTimeout(
              hammerTimerMap.get(element.id) as unknown as NodeJS.Timeout
            );
            hammerTimerMap.set(
              element.id,
              setTimeout(() => {
                getBackToOriginalSize(element);
              }, 1650)
            );
          };
        }
      );
    } else {
      logger("eachScreenHammerMode is false");
      getContainerElem().classList.remove(
        constants.videoChat.mode.eachScreenAndHammerMode
      );
      Array.from(document.getElementsByClassName("img-wrapper-div")).forEach(
        (elem) => {
          const element = elem as HTMLDivElement;
          element.style.opacity = "1";
          element.onclick = null;
        }
      );
    }
  }, [
    divHitByHammer,
    eachScreenHammerMode,
    getBackToOriginalSize,
    getContainerElem,
    hammerTimerMap,
  ]);

  return (
    <>
      <SmoothyVideoFrameLayoutStyle>
        <div className="multi-media-container">
          {/* {youtubeMode && <YoutubeView />} */}
          {/* {youtubeMode && <YoutubeIFrameWebview/>} */}
          <div className="img-container">
            <div className="img-div">
              <div className="img-wrapper-div" id="img-wrapper-div1">
                <img
                  src={process.env.PUBLIC_URL + "/images/test1.jpg"}
                  className="video"
                  alt="test1"
                />
                <VolumeOff
                  style={{ position: "absolute", bottom: 0, left: 0 }}
                />
              </div>
            </div>
            <div className="img-div">
              <div className="img-wrapper-div" id="img-wrapper-div2">
                <img
                  src={process.env.PUBLIC_URL + "/images/test2.jpg"}
                  className="video"
                  alt="test2"
                />
              </div>
            </div>
            <div className="img-div">
              <div className="img-wrapper-div" id="img-wrapper-div3">
                <ImgWithFallback
                  src={process.env.PUBLIC_URL + "/images/test4.jpg"}
                  fallback={process.env.PUBLIC_URL + "/images/test3.jpg"}
                  alt="A photo showing the expiration date on a box of Lucky Charms"
                />
              </div>
            </div>
            <div className="img-div">
              <div className="img-wrapper-div" id="img-wrapper-div4">
                <ImgWithFallback
                  src={process.env.PUBLIC_URL + "/images/test5.jpg"}
                  fallback={process.env.PUBLIC_URL + "/images/test3.jpg"}
                  alt="A photo showing the expiration date on a box of Lucky Charms"
                />
              </div>
            </div>
          </div>
          <div className="btn-space-div">
            <Button variant="outlined" id="new-chat-start-btn">
              새통화 시작
            </Button>
          </div>
          <EffectButtonSpaceForTest
            fullscreenConstainerDivElem={getContainerElem}
            activeEachScreenHammerMode={activateEachScreenHammerMode}
            deactiveEachScreenHammerMode={deactivateEachScreenHammerMode}
            eachScreenHammerMode={eachScreenHammerMode}
            youtubeMode={youtubeMode}
          />
        </div>
      </SmoothyVideoFrameLayoutStyle>
    </>
  );
}

export default SmoothyVideoFrameLayout;
