import { LinearProgress } from "@material-ui/core";
import React, { DragEvent, useCallback, useState } from "react";
import styled from "styled-components";
import constants from "../../lib/common/constants";
import logger from "../../lib/custom-logger/logger";

const YoutubeDetailStyle = styled.div`
  #test-div {
    position:absolute;
    top: 100px
  }
  #video-detail-div {
    /* width:100%; */
  }
  #unclickable-div {
    /* visibility:hidden; */
    pointer-events: none;
    position: relative;
    /* width:100%; */
  }
  #youtube-player {
    /* visibility:visible */
    width: 100%;
  }
  #img-player-play {
    position: absolute;
    background-color: red;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: stroke;
  }
  #img-player-pause {
    position: absolute;
    background-color: red;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* visibility:hidden */
  }
  #img-player-pause:not(:hover) {
    opacity: 0;
  }
  #player-progress-bar {
    /* position:absolute;
    bottom:15%;
    width:100%; */
    /* z-index: ${constants.smoothy.zidx.btn}; */
    /* pointer-events:stroke;
    cursor: pointer; */
  }
  #img-player-now-wrapper {
    /* border: 1px solid gray; */
    box-sizing: border-box;
    position: absolute;
    transform: translate(-50%,-30%); // px 로 계산하는게 맞을수도
    z-index: ${constants.smoothy.zidx.btn};
    fill: red;
    /* background-color:green; */
    /* height: 10px; */
    cursor: pointer;
  }
  #img-player-now {
    // 여기 변경 사항은 아래 js 에도 바꿔줘야함
    /* position: absolute; */
    /* bottom:15%; */
  }
  /* #player-progress-bar-wrapper {
    border: 5px solid gray;
    box-sizing: border-box;
  } */
  #progress-container {
    /* border: 1px solid gray;
    box-sizing: border-box; */
    /* z-index: ${constants.smoothy.zidx.btn}; */
    position: absolute;
    bottom: 15%;
    width: 80%;
    left:10%;
    /* z-index: ${constants.smoothy.zidx.btn}; */
    cursor: pointer;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .display-out {
    display: none;
  }
  .pointer-event-possible {
    pointer-events: stroke;
  }
`;
function DragTest() {
  const [progress, setProgress] = useState(0);
  const [progressTimer] = useState(undefined as unknown as NodeJS.Timeout);

  const nowOnDrag = (event: DragEvent) => {
    // console.log("nowOnDrag");
    // pauseVideo()
    // const playBtn = document.getElementById('img-player-play')
    // const elems = document.getElementsByClassName('pointer-event-possible')
    // Array.from(elems).forEach(elem=>{
    // })
    // playBtn?.classList.remove()
    // todo ::
    event.preventDefault();
    const posX = event.pageX;
    // const now = (document.getElementById(
    //   "img-player-now-wrapper"
    // ) as unknown) as SVGElement;
    // console.log(posX)

    const barWrapper = document.getElementById('player-progress-bar-wrapper')
    const barWrapperLeft = barWrapper?.getBoundingClientRect().left as number
    const barWrapperRight = barWrapper?.getBoundingClientRect().right as number
    const ratio = (posX - barWrapperLeft)/(barWrapperRight - barWrapperLeft) * 100
    // console.log(posX , barWrapperLeft , barWrapperRight)

    if (posX){
      // 마지막에 0 이 되는 순간이있다.
      // now.style.left = `${Math.min(Math.max(posX - barWrapperLeft,0),barWrapperRight - barWrapperLeft)}px`;
      // now.style.left = `${Math.min(Math.max(ratio,0),100)}%`;
      syncProgress(progressTimer , 0 , Math.min(Math.max(ratio,0),100))
      // now.style.left = `${posX - barWrapperLeft}px`;
    }
  };
  const nowOnDragStart = (event: DragEvent) => {
    const posX = event.pageX;
    const posY = event.pageY;
    const distX = event.screenX - posX;
    const distY = event.screenY - posY;
    console.log("nowDragStart", event, posX, posY, distX, distY);

    // create an empty <span>
    // var dragImgEl = document.createElement('span');
    // dragImgEl.setAttribute('style','position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;' );
    // document.body.appendChild(dragImgEl);
    var img = document.createElement('img')
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    event.dataTransfer.setDragImage(img,0,0)

    const playBtn = document.getElementById("img-player-play");
    const pauseBtn = document.getElementById("img-player-pause");
    playBtn?.classList.remove("pointer-event-possible");
    pauseBtn?.classList.remove("pointer-event-possible");
  };

  const nowOnDragEnd = (event: DragEvent) => {
    // event.preventDefault()
    const posX = event.pageX;
    const posY = event.pageY;
    const distX = event.screenX - posX;
    const distY = event.screenY - posY;
    console.log("nowOnDragEnd", event, posX, posY, distX, distY);
    // const now = (document.getElementById(
    //   "img-player-now-wrapper"
    // ) as unknown) as SVGElement;
    // now.style.left = `${posX}px`;

    const playBtn = document.getElementById("img-player-play");
    const pauseBtn = document.getElementById("img-player-pause");
    playBtn?.classList.add("pointer-event-possible");
    pauseBtn?.classList.add("pointer-event-possible");
  };

  const syncProgress = useCallback((timer:NodeJS.Timer , change:number , certainProgress?:number)=>{
    // logger('syncProgress')
    if (certainProgress || certainProgress === 0){
      // logger('syncProgress1' , timer , change , certainProgress)
      setProgress(certainProgress)
      const now = document.getElementById('img-player-now-wrapper') as unknown as SVGElement
      now.style.left = `${certainProgress}%`
            // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translateY(25%);translateX(${0});z-index: ${constants.smoothy.zidx.btn}`);
            // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translate(-25%,25%);left:${certainProgress};z-index: ${constants.smoothy.zidx.btn}`);
    }else{
      // logger('syncProgress2' , timer , change , certainProgress)
      setProgress(oldProgress => {
        if (oldProgress >= 100) {
          clearInterval(timer);
        }
        const newProgress = Math.min(oldProgress + change, 100)
        
        //progress now
        const now = document.getElementById('img-player-now-wrapper') as unknown as SVGElement
        now.style.left = `${certainProgress}%`
        // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translateY(25%);translateX(${newProgress});z-index: ${constants.smoothy.zidx.btn}`);
        // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translate(-25%,25%);left:${newProgress}%;z-index: ${constants.smoothy.zidx.btn}`);
        
        return newProgress;
      });
    }
  },[setProgress])
  const testOnClick = ()=>{
    const barWrapper = document.getElementById('player-progress-bar-wrapper')
    console.log(barWrapper?.getBoundingClientRect())
  }
  return (
    <>
      <YoutubeDetailStyle>
        <div id ="test-div" onClick={testOnClick}>hihi</div>
        <div
          id="progress-container"
          className="cursor-pointer pointer-event-possible"
        >
          {/* <div id="img-player-now-wrapper" className="cursor-pointer pointer-event-possible" draggable="true" onDrag={nowOnDrag} onDragStart={nowOnDragStart} onDragEnd={nowOnDragEnd}> */}
          <div
            id="img-player-now-wrapper"
            draggable="true"
            onDrag={nowOnDrag}
            onDragStart={nowOnDragStart}
            onDragEnd={nowOnDragEnd}
          >
            <svg
              id="img-player-now"
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              fill="none"
              viewBox="0 0 11 11"
            >
              <circle
                id="img-player-now-circle"
                cx="5.5"
                cy="5.5"
                r="5.5"
                fill="red"
              />
            </svg>
          </div>
          {/* <div id="player-progress-bar-wrapper" className="cursor-pointer pointer-event-possible" onDrag={nowOnDrag} onDragStart={nowOnDragStart} onDragEnd={nowOnDragEnd}> */}
          <div id="player-progress-bar-wrapper" draggable="false">
            <LinearProgress
              id="player-progress-bar"
              draggable="false"
              color="secondary"
              variant="determinate"
              value={progress}
            />
          </div>
        </div>
      </YoutubeDetailStyle>
    </>
  );
}

export default DragTest;
