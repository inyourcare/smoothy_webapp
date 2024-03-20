import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import styled from "styled-components";
import constants from "../lib/common/constants";
// import logger from "../lib/custom-logger/logger";
import { RootState } from "../modules";
import { ADD_FULLSCREEN_EFFECT } from "../modules/firebase";
// import { ACTIVATE_YOUTUBE, DEACTIVATE_YOUTUBE } from "../modules/smoothy";

const EffectButtonSpaceStyle = styled.div`
  .effect-space-container {
    position: absolute;
    top: -250%;
    left: 50%;
    transform: translateX(-50%);
    z-index: ${constants.smoothy.zidx.btn};
    width: 90vw;
    height: 100px;
    padding: 0px 16px 30px 16px; // 위 왼 아래 오
    border-radius: 16px;
    background-color: rgba(0, 0, 0, 0.4);
    max-width: 960px;
  }
  .effect-space {
    position: absolute;
    top: 25px;
    /* top: -220%;
    left: 50%;
    transform: translateX(-50%);
    z-index: ${constants.smoothy.zidx.btn}; */
    /* display: none; */
    /* background-color: yellowgreen; */
    white-space: nowrap;
    flex-direction: row;
    overflow-x: scroll;
    width: inherit;
    max-width: 960px;
    /* width: 90vw;
    height: 100px;
    padding: 5px 16px 16px 16px; // 위 왼 아래 오
    border-radius: 16px;
    background-color: rgba(0, 0, 0, 0.4); */
    /* scrollbar-color: #6969dd #e0e0e0;
    scrollbar-width: thin; */
  }
  /* .effect-space::-webkit-scrollbar-track {
    background-color: #6969dd;
  } */
  .effect-space-btn:hover {
    & img {
      transform: scale(1.1);
    }
  }
  .hammer-mode-border-img {
    /* border: 5px solid #eaeaea; */
    padding: 0px;
  }
  #reaction-close-btn {
    position: relative;
    float: right;
    /* top:5px; */
    right: 5px;
    /* top: -225%; */
    min-width: 5px;
    /* height: 10px; */
    z-index: ${constants.smoothy.zidx.btn+5};
    /* margin-bottom: 100px; */
  }
  #reaction-close-btn-div {
    position: absolute;
    top: -220%;
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
    height: 120px;
    padding: 0px 16px 16px 16px; // 위 왼 아래 오
    border-radius: 16px;
    background-color: rgba(0, 0, 0, 0.4);
    /* opacity: 0.5; */
  }
`;

type EffectButtonSpaceProps = {
  // partyId: string;
  fullscreenHammerEffectOnClick: (
    e: React.MouseEvent,
    effectName: string
  ) => void;
  // youtubeMode: boolean;
  hammerMode: boolean;
  setClose: (e: boolean) => void;
  // enable: boolean;
};
function EffectButtonSpace({
  // partyId,
  fullscreenHammerEffectOnClick,
  // youtubeMode,
  hammerMode,
  setClose,
}: // enable,
EffectButtonSpaceProps) {
  // const [activeEffect, setActiveEffect] = useState(false);
  const dispatch = useDispatch();
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const fullscreenEffectOnClick = (e: React.MouseEvent, effectName: string) => {
    dispatch({ type: ADD_FULLSCREEN_EFFECT, payload: {
      count: 0,
      item: effectName,
      sendTimeStamp: 1234,
      sender: 'sender',
  } });
    // appendFullscreenReaction(effectName, parent() as Element);
    // addFullscreenReaction(
    //   partyId,
    //   undefined,
    //   effectName,
    //   getCurrentUser()?.uid as string
    // );
  };
  // const activeEffectClick = () => {
  //   setActiveEffect(!activeEffect);
  // };
  // const toggleYoutubeMode = useCallback(() => {
  //   if (youtubeMode === true) {
  //     logger("EffectButtonSpace deactivate");
  //     dispatch({ type: DEACTIVATE_YOUTUBE, payload: partyId });
  //   } else dispatch({ type: ACTIVATE_YOUTUBE });
  // }, [dispatch, partyId, youtubeMode]);
  return (
    <>
      <EffectButtonSpaceStyle>
        {/* {enable ? ( */}
        {/* <div className="effect-space"> */}
        <div className="effect-space-container">
        <Button id="reaction-close-btn" onClick={()=>{setClose(false)}}  disabled={buttonDisable}>
          <img
            src={constants.smoothy.images.effect.reactClose}
            // className="ic_chatroom_toolbar_camera_on"
            alt="reaction-close"
          />
        </Button>
          <div className="effect-space">
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "009_fullscreen_thundervolt")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "009_fullscreen_thundervolt");
                }
              }
              disabled={buttonDisable}
            >
              {/* 009_fullscreen_thundervolt */}
              <img
                src={constants.smoothy.images.effect.reaction009}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "010_fullscreen_lovelove")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "010_fullscreen_lovelove");
                }
              }
              disabled={buttonDisable}
            >
              {/* 010_fullscreen_lovelove */}
              <img
                src={constants.smoothy.images.effect.reaction010}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "011_fullscreen_shakeshake")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "011_fullscreen_shakeshake");
                }
              }
              disabled={buttonDisable}
            >
              {/* 011_fullscreen_shakeshake */}
              <img
                src={constants.smoothy.images.effect.reaction011}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenHammerEffectOnClick(
                //   e,
                //   constants.reaction.eachscreen.hammer.img
                // )
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(
                    e,
                    constants.reaction.eachscreen.hammer.img
                  );
                }
              }
              disabled={buttonDisable}
            >
              {/* {constants.reaction.eachscreen.hammer.img} */}
              <img
                src={constants.smoothy.images.effect.reaction012}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
                className={hammerMode ? "hammer-mode-border-img" : ""}
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "013_fullscreen_confettie")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "013_fullscreen_confettie");
                }
              }
              disabled={buttonDisable}
            >
              {/* 013_fullscreen_confettie */}
              <img
                src={constants.smoothy.images.effect.reaction013}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "014_fullscreen_starbomb")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "014_fullscreen_starbomb");
                }
              }
              disabled={buttonDisable}
            >
              {/* 014_fullscreen_starbomb */}
              <img
                src={constants.smoothy.images.effect.reaction014}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "015_fullscreen_flowerrain")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "015_fullscreen_flowerrain");
                }
              }
              disabled={buttonDisable}
            >
              {/* 015_fullscreen_flowerrain */}
              <img
                src={constants.smoothy.images.effect.reaction015}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "016_fullscreen_kkkk")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "016_fullscreen_kkkk");
                }
              }
              disabled={buttonDisable}
            >
              {/* 016_fullscreen_kkkk */}
              <img
                src={constants.smoothy.images.effect.reaction016}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "017_fullscreen_gloomyrain")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "017_fullscreen_gloomyrain");
                }
              }
              disabled={buttonDisable}
            >
              {/* 017_fullscreen_gloomyrain */}
              <img
                src={constants.smoothy.images.effect.reaction017}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "023_fullscreen_halloweenweb")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "023_fullscreen_halloweenweb");
                }
              }
              disabled={buttonDisable}
            >
              {/* 023_fullscreen_halloweenweb */}
              <img
                src={constants.smoothy.images.effect.reaction023}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "024_fullscreen_snow")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "024_fullscreen_snow");
                }
              }
              disabled={buttonDisable}
            >
              {/* 024_fullscreen_snow */}
              <img
                src={constants.smoothy.images.effect.reaction024}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "025_fullscreen_fireworks")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "025_fullscreen_fireworks");
                }
              }
              disabled={buttonDisable}
            >
              {/* 025_fullscreen_fireworks */}
              <img
                src={constants.smoothy.images.effect.reaction025}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "030_fullscreen_goldconfetti")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "030_fullscreen_goldconfetti");
                }
              }
              disabled={buttonDisable}
            >
              {/* 030_fullscreen_goldconfetti */}
              <img
                src={constants.smoothy.images.effect.reaction030}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            <Button
              className="effect-space-btn"
              onClick={(e) =>
                // fullscreenEffectOnClick(e, "031_fullscreen_realmoneyrain")
                {
                  const target = e.currentTarget;
                  target.classList.add(constants.animation.buttonClicked);
                  setTimeout(() => {
                    target.classList.remove(constants.animation.buttonClicked);
                  }, 500);
                  fullscreenEffectOnClick(e, "031_fullscreen_realmoneyrain");
                }
              }
              disabled={buttonDisable}
            >
              {/* 031_fullscreen_realmoneyrain */}
              <img
                src={constants.smoothy.images.effect.reaction031}
                // className="ic_chatroom_toolbar_camera_on"
                alt="reaction"
              />
            </Button>
            {/* <button className="btn" onClick={(e) => toggleYoutubeMode()}>
                  youtube
                </button> */}
          </div>
        </div>
      </EffectButtonSpaceStyle>
    </>
  );
}

export default EffectButtonSpace;
