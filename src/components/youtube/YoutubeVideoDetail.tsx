// import { useSelector } from "react-redux";
import { LinearProgress } from "@material-ui/core";
import React, { DragEvent, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import YouTube, { Options } from "react-youtube";
import styled from "styled-components";
import constants from "../../lib/common/constants";
import logger from "../../lib/custom-logger/logger";
import {
  getCurrentUser,
  setPlayback,
  YoutubePlayback,
  changePlayback,
} from "../../lib/firebase";
import { RootState } from "../../modules";
// import { RootState } from "../../modules";

const YoutubeDetailStyle = styled.div`
  /* border: 5px solid pink; */

  #youtube-wrapper-wrapper-div:hover {
    /* width:100%; */
    & #progress-container {
      visibility: visible;
    }
  }
  #unclickable-youtube-wrapper-div {
    /* visibility:hidden; */
    pointer-events: none;
    position: relative;
    /* width:100%; */

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  #youtube-player {
    /* visibility:visible */
    /* width:100% */
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
  #player-progress-bar-wrapper {
    position: relative;
    /* z-index: ${constants.smoothy.zidx.btn}; */
    /* pointer-events:stroke;
    cursor: pointer; */
    /* position:absolute; */
    width: 100%;
  }
  /* #img-player-now-wrapper { */
  /* border: 5px solid gray;
    box-sizing: border-box; */
  /* } */
  #img-player-now-wrapper {
    // 여기 변경 사항은 아래 js 에도 바꿔줘야함
    fill: red;
    position: absolute;
    /* bottom:15%; */
    /* transform: translate(-50%,-6.5px); // px 로 계산하는게 맞을수도 일단 now 의 크기가 11 이라 6.5 로 함 추후 문제있으면 더 생각하자 */
    /* height: 11px; // svg 파일 크기에 맞춰야함 */
    /* top:50%; */
    /* left: 0%; */
    transform: translate(-50%, 0%);
    z-index: ${constants.smoothy.zidx.blocking + 10};
    /* cursor: pointer; */
    display: flex;
    justify-content: center;
    align-items: center;

    top: 50%;
    transform: translate(-50%, -50%);
  }
  /* #player-progress-bar-wrapper { */
  #progress-container {
    /* border: 10px solid gray;
    box-sizing: border-box; */
    /* z-index: ${constants.smoothy.zidx.btn}; */
    position: absolute;
    bottom: 10px;
    width: 100%;
    z-index: ${constants.smoothy.zidx.blocking + 5};
    /* cursor: pointer; */
    visibility: hidden;

    /* height: 100px; */
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  #youtube-bloking-div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.3;
    z-index: ${constants.smoothy.zidx.blocking};
    pointer-events: none;
    /* border: 5px solid gray;
    box-sizing: border-box; */
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

type YoutubeVideoDetailProps = {
  // video: youtubeSearch.YouTubeSearchResults;
  videoId: string;
  title?: string;
  description?: string;
  // video: YoutubeVideoType;
  // _onReady: (e: any) => void;
  // _onEnd: () => void;
  // _onStateChange: (e: any)=>void;
  partyId: string | undefined;
};
function YoutubeVideoDetail({
  videoId,
  title,
  description,
  // _onReady,
  // _onEnd,
  // _onStateChange,
  partyId,
}: YoutubeVideoDetailProps) {
  const { sharedVideoPlayback, playlist } = useSelector(
    (state: RootState) => state.smoothy.youtube
  );
  const { youtubeVideoDivWidthHeight } = useSelector(
    (state: RootState) => state.smoothy
  );

  // const classes = useStyles();
  // const [playerPlay , setPlayerPlay] = useState(`${process.env.PUBLIC_URL}/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_play.svg`);
  // const [playerPause , setPlayerPause] = useState(`${process.env.PUBLIC_URL}/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_stop.svg`);
  // const [emptyImg , setEmptyImg] = useState(document.createElement('img'))
  // const [now , setNow] = useState(document.getElementById('img-player-now-wrapper') as unknown as SVGElement)
  // const [barWrapper , setBarWrapper] = useState(document.getElementById('player-progress-bar-wrapper'))
  // emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  // const [playBtn , setPlayBtn] = useState(document.getElementById("img-player-play"));
  // const [pauseBtn , setPauseBtn] = useState(document.getElementById("img-player-pause"));

  // setPlayerPlay(`${process.env.PUBLIC_URL}/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_play.svg`)
  // setPlayerPause(`${process.env.PUBLIC_URL}/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_stop.svg`)
  // setNow(document.getElementById('img-player-now-wrapper') as unknown as SVGElement)
  // setBarWrapper(document.getElementById('player-progress-bar-wrapper'))
  // setPlayBtn(document.getElementById("img-player-play"))
  // setPauseBtn(document.getElementById("img-player-pause"))
  // logger('valuables set finished')
  // const now = document.getElementById('img-player-now-wrapper') as unknown as SVGElement
  const barWrapper = document.getElementById("player-progress-bar-wrapper");
  const playBtn = document.getElementById("img-player-play");
  const pauseBtn = document.getElementById("img-player-pause");
  const blockingDiv = document.getElementById("youtube-bloking-div");

  const emptyImg = document.createElement("img");
  emptyImg.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  // const progressNow = `${process.env.PUBLIC_URL}/images/assets_30_watchparty_player_2021-05-13/ic/playbar/now.svg`;
  const [player, setPlayer] = useState(undefined as any);
  const [progress, setProgress] = useState(0);
  const [progressTimer, setProgressTimer] = useState(
    undefined as unknown as NodeJS.Timeout
  );
  const [playerPlayback, setPlayerPlayback] = useState(
    null as unknown as YoutubePlayback
  ); // 플레이어에서 사용할
  const [prevVideoId, setPrevVideoId] = useState("");
  const [prevPlayerControl, setPrevPlayerControl] = useState("");
  const [prevPosition, setPrevPosition] = useState(0);
  const [isPlayClicked, setIsPlayClicked] = useState(false);
  const [isPauseClicked, setIsPauseClicked] = useState(false);
  const [isDraggHappened, setIsDraggHappened] = useState(false);

  const _onReady = useCallback((event: any) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
    const newPlayer = event.target;
    setPlayer(newPlayer);
    logger("_onReady", event);
  }, []);

  const syncProgress = useCallback(
    (timer: NodeJS.Timer, change: number, certainProgress?: number) => {
      // logger('syncProgress' , timer , change , certainProgress)
      if (certainProgress || certainProgress === 0) {
        logger("syncProgress1", timer, change, certainProgress);
        // 영상 position 이 강제 변경되는 경우
        setProgress(certainProgress);
        const now = document.getElementById(
          "img-player-now-wrapper"
        ) as unknown as SVGElement;
        now.style.left = `${certainProgress}%`;
        // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translateY(25%);translateX(${0});z-index: ${constants.smoothy.zidx.btn}`);
        // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translate(-25%,25%);left:${certainProgress};z-index: ${constants.smoothy.zidx.btn}`);
      } else {
        // logger('syncProgress2' , timer , change , certainProgress)
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
          }
          const newProgress = Math.min(oldProgress + change, 100);

          //progress now
          const now = document.getElementById(
            "img-player-now-wrapper"
          ) as unknown as SVGElement;
          now.style.left = `${newProgress}%`;
          // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translateY(25%);translateX(${newProgress});z-index: ${constants.smoothy.zidx.btn}`);
          // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translate(-25%,25%);left:${newProgress}%;z-index: ${constants.smoothy.zidx.btn}`);

          return newProgress;
        });
      }
    },
    [setProgress]
  );

  // 프로그래스 진행
  const startProgress = useCallback(() => {
    const spliter = 10; // 1 이면 1초에 한번씩 10 이면 0.1초에 한번씩
    logger("[startProgress]", playerPlayback);
    if (playerPlayback && playerPlayback.lengthSeconds) {
      const change = 100 / (playerPlayback.lengthSeconds * spliter); // 100 이 최대값
      logger("[progressEffect]change->", change, playerPlayback.lengthSeconds);
      const timer = setInterval(() => {
        syncProgress(timer, change); // syncProgress 중 change 를 계속 더해서 100이되면 timer 를 clear 하는 로직 타게 됨
      }, 1000 / spliter);

      // 재생창은 하나고 프로그래스 타이머는 하나만 실행되야 하므로 만약을 대비해 기존의 progressTimer 를 clear
      if (progressTimer) clearInterval(progressTimer);
      setProgressTimer(timer);
    }
  }, [playerPlayback, progressTimer, syncProgress]);

  // posX 와 barWrapper 간격의 비율을 구해주는 callback
  // const getRatioBetweenNowAndBarWrapper = useCallback((posX:number)=>{
  const getRatioBetweenNowAndBarWrapper = useCallback(
    (posX: number) => {
      const barWrapperLeft = barWrapper?.getBoundingClientRect().left as number;
      const barWrapperRight = barWrapper?.getBoundingClientRect()
        .right as number;
      const ratio =
        (posX - barWrapperLeft) / (barWrapperRight - barWrapperLeft);
      return [ratio, barWrapperLeft, barWrapperRight];
    },
    [barWrapper]
  );
  // ,[])

  // player play 전 now 의 포지션 값 계산
  const getProgressNowPosition = useCallback(() => {
    const now = document.getElementById(
      "img-player-now-wrapper"
    ) as unknown as SVGElement;
    // const barWrapper = document.getElementById('player-progress-bar-wrapper')
    // const barWrapperLeft = barWrapper?.getBoundingClientRect().left as number
    // const barWrapperRight = barWrapper?.getBoundingClientRect().right as number
    // const ratio = (now.getBoundingClientRect().left - barWrapperLeft)/(barWrapperRight - barWrapperLeft)
    // const ratio = getRatioBetweenNowAndBarWrapper(now.getBoundingClientRect().left)
    const [ratio] = getRatioBetweenNowAndBarWrapper(
      now.getBoundingClientRect().left
    );
    if (partyId) return (playerPlayback.lengthSeconds as number) * ratio;
    else return Number(player.getDuration()) * ratio;
  }, [
    getRatioBetweenNowAndBarWrapper,
    partyId,
    player,
    playerPlayback?.lengthSeconds,
  ]);
  // 비디오 재생시키는 callback
  const playVideo = useCallback(() => {
    logger("[playVideo]");
    setTimeout(() => {
      player.seekTo(getProgressNowPosition(), true);
      player.playVideo();
      startProgress();
      // const playBtn = document.getElementById('img-player-play')
      // const pauseBtn = document.getElementById('img-player-pause')
      // playBtn?.classList.add('display-out')
      // pauseBtn?.classList.remove('display-out')
    }, constants.smoothy.latency.youtube.player);
    // },[player, playerPlayback?.lengthSeconds, startProgress])
  }, [getProgressNowPosition, player, startProgress]);

  // 비디오 정지시키는 callback
  const pauseVideo = useCallback(() => {
    logger("[pauseVideo]");
    setTimeout(() => {
      player.pauseVideo();
      clearInterval(progressTimer);
      // const playBtn = document.getElementById('img-player-play')
      // const pauseBtn = document.getElementById('img-player-pause')
      // playBtn?.classList.remove('display-out')
      // pauseBtn?.classList.add('display-out')
    }, constants.smoothy.latency.youtube.player);
  }, [player, progressTimer]);

  // 플레이또는 정지버튼을 직접 클릭했을 때 callback
  const playOnClick = useCallback(
    (e) => {
      logger("playerClicked");
      playVideo();
      setIsPlayClicked(true);
    },
    [playVideo]
  );
  const pauseOnClick = useCallback(
    (e) => {
      logger("pauseClicked");
      pauseVideo();
      setIsPauseClicked(true);
    },
    [pauseVideo]
  );

  // now 버튼 드래그했을 때 callback
  // const nowOnDrag = useCallback((event: DragEvent) => {
  const nowOnDrag = (event: DragEvent) => {
    event.preventDefault();
    const posX = event.pageX;
    const now = document.getElementById(
      "img-player-now-wrapper"
    ) as unknown as SVGElement;
    // console.log(posX)

    // const barWrapper = document.getElementById('player-progress-bar-wrapper')
    // const ratio = getRatioBetweenNowAndBarWrapper(posX) * 100
    const [ratio] = getRatioBetweenNowAndBarWrapper(posX);

    if (posX) {
      // syncProgress(progressTimer , 0 , Math.min(Math.max(ratio,0),100))
      now.style.left = `${Math.min(Math.max(ratio * 100, 0), 100)}%`;
      // now.style.left = `${Math.min(Math.max(ratio* 100,barWrapperLeft),barWrapperRight)}%`
      syncProgress(progressTimer, 0, Math.min(Math.max(ratio * 100, 0), 100));
    }
  };
  // ,[getRatioBetweenNowAndBarWrapper]);

  const blockClicking = useCallback(() => {
    playBtn?.classList.remove("pointer-event-possible");
    pauseBtn?.classList.remove("pointer-event-possible");
    blockingDiv?.classList.remove("display-out");
  }, [blockingDiv?.classList, pauseBtn?.classList, playBtn?.classList]);
  const unblockClicking = useCallback(() => {
    playBtn?.classList.add("pointer-event-possible");
    pauseBtn?.classList.add("pointer-event-possible");
    blockingDiv?.classList.add("display-out");
  }, [blockingDiv?.classList, pauseBtn?.classList, playBtn?.classList]);

  // now 버튼 드래그 스타트 callback
  // const nowOnDragStart = useCallback((event: DragEvent) => {
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

    event.dataTransfer.setDragImage(emptyImg, 0, 0); // emptyImg 를 set 해주지 않으면 이상한 이미지가 나온다.

    // const playBtn = document.getElementById("img-player-play");
    // const pauseBtn = document.getElementById("img-player-pause");

    // 이유는 모르겠지만 유튜브에서 disable 시키는 동작을 copy 함
    // playBtn?.classList.remove("pointer-event-possible");
    // pauseBtn?.classList.remove("pointer-event-possible");
    blockClicking();
    // pauseVideo()
  };
  // ,[player]);

  // now 버튼 드래그 마무리 callback
  // const nowOnDragEnd = useCallback((event: DragEvent) => {
  const nowOnDragEnd = (event: DragEvent) => {
    // event.preventDefault()
    const posX = event.pageX;
    const posY = event.pageY;
    const distX = event.screenX - posX;
    const distY = event.screenY - posY;
    console.log("nowOnDragEnd", event, posX, posY, distX, distY);
    const now = document.getElementById(
      "img-player-now-wrapper"
    ) as unknown as SVGElement;
    now.style.left = `${posX}px`;

    // const playBtn = document.getElementById("img-player-play");
    // const pauseBtn = document.getElementById("img-player-pause");
    // 스타트 동작에서 disable 된 클릭 방지를 복구함
    // playBtn?.classList.add("pointer-event-possible");
    // pauseBtn?.classList.add("pointer-event-possible");
    unblockClicking();

    // const barWrapper = document.getElementById('player-progress-bar-wrapper')
    // const barWrapperLeft = barWrapper?.getBoundingClientRect().left as number
    // const barWrapperRight = barWrapper?.getBoundingClientRect().right as number
    // const ratio = (posX - barWrapperLeft)/(barWrapperRight - barWrapperLeft)
    // const ratio = getRatioBetweenNowAndBarWrapper(posX)
    const [ratio] = getRatioBetweenNowAndBarWrapper(posX);
    syncProgress(progressTimer, 0, Math.min(Math.max(ratio * 100, 0), 100)); // 드래그가 끝나면서 올바른 포지션으로 가도록 변경
    // syncProgress(progressTimer , 0 , Math.min(Math.max(ratio*100,barWrapperLeft),barWrapperRight)) // 드래그가 끝나면서 올바른 포지션으로 가도록 변경

    if (player && playerPlayback) {
      logger(
        "player seek to",
        playerPlayback.lengthSeconds as number,
        ratio,
        (playerPlayback.lengthSeconds as number) * ratio
      );
      player.seekTo((playerPlayback.lengthSeconds as number) * ratio, true); // 온드래그에서 seekTo 하면 과부하되므로 마지막에 찾도록 함
    }
    setIsDraggHappened(true);
  };
  // ,[getRatioBetweenNowAndBarWrapper]);

  // default effect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultEffect = useEffect(() => {
    // valuable 여기서 set 해보려했지만 fail (component render 보다 이게 더 빠른듯)
    return () => {
      logger("[defaultEffect]clear stuffes!!!!!", progressTimer);
      clearInterval(progressTimer); // 혹시라도 youtube mode 가 갑자기 꺼졌을 경우 timer 가 돌아가는 현상이 있어 default effect 생성함
    };
  }, [progressTimer]);

  // 플레이백 세팅하기 위한 effect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playbackEffect = useEffect(() => {
    // playerPlayback 은 어떤 경우에도 존재하도록 만든다. (Functions 에러가 있을 경우 제외)
    if (sharedVideoPlayback) {
      setPlayerPlayback(sharedVideoPlayback);
    } else {
      // if (partyId && videoId && prevVideoId !== videoId){
      // getYoutubeVideoInfo(video.id).then(async function(data){
      //   var newPlayback = data as YoutubePlayback
      //   logger("[playbackEffect]newPlayback->" , newPlayback)
      //   // newPlayback.control = constants.youtube.control.play
      //   // newPlayback.sender = getCurrentUser()?.uid as string
      //   // newPlayback.sendTimestamp = await getServerTime()
      //   newPlayback.position = 0
      //   if (partyId){
      //     // 대화방 -> 내가 비디오를 먼저 shared 하려 한 경우
      //     logger('[playbackEffect]shared player set' , newPlayback)
      //     setPlayback(partyId as string,newPlayback)
      //   } else {
      //     // 테스트 또는 로컬의 경우
      //     logger('[playbackEffect]locally player set' , newPlayback)
      //     setPlayerPlayback(newPlayback)
      //   }
      // })
      // .catch(function(err){
      //   logger("[playbackEffect]error::" , err)
      //   alert('watch party 가 불가능한 영상입니다.')
      //   syncProgress(progressTimer,0,0) // todo :: 갑자기 유튜브 서치가 막혀서 테스트 못함 (에러있을 경우 progress 초기화 테스트)
      // })

      // playlist 받으면서 VideoInfo 받기때문에 그냥 처리
      // 이 경우는 내가 처음 시작하는 경우만 해당
      if (partyId && videoId && prevVideoId !== videoId) {
        // 대화방 -> 내가 비디오를 먼저 shared 하려 한 경우

        const selectedList = playlist?.filter(
          (playItem) => playItem.videoId === videoId
        ) as YoutubePlayback[];
        if (selectedList && selectedList.length > 0) {
          const selected = selectedList[0]
          selected.control = constants.youtube.control.play;
          selected.position = 0;
          logger("[playbackEffect]shared player set", selected);
          setPlayback(partyId as string, selected); // firebase db 쓰기
        }
      } else {
        // // 테스트 또는 로컬의 경우
        // if (selectedVideo){
        // logger("[playbackEffect]locally player set", selectedVideo);
        logger("[playbackEffect]locally player not playing");
        // setPlayerPlayback({
        //   control:constants.youtube.control.play,
        //   position: 0,
        //   videoId: selectedVideo.id,
        //   thumbnailUrl: selectedVideo.thumbnail,
        //   title: selectedVideo.title
        // });}
      }
    }
    // }
  }, [
    partyId,
    playlist,
    prevVideoId,
    progressTimer,
    sharedVideoPlayback,
    syncProgress,
    videoId,
  ]);

  // 플레이백으로 player 제어하기 위한 effect
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playerPlaybackEffect = useEffect(() => {
    // 플레이어가 playerPlayback 에 제어받도록 만든다.
    // 클릭에 의한 변경과 무결하도록 만든다.
    // 영상의 position 관련해서는 sync 함수를 활용
    if (playerPlayback && player) {
      const videoId = playerPlayback.videoId as string;
      if (prevVideoId !== videoId) {
        // 영상 변경 되었을 때
        setPrevVideoId(playerPlayback.videoId as string);
        // setProgress(0)
        // const now = document.getElementById('img-player-now') as unknown as SVGElement
        //       // now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translateY(25%);translateX(${0});z-index: ${constants.smoothy.zidx.btn}`);
        //       now.setAttribute("style", `fill:red;position:absolute;bottom:15%;transform: translateY(25%);left:0;z-index: ${constants.smoothy.zidx.btn}`);
        syncProgress(progressTimer, 0, 0);
        if (playerPlayback.control === constants.youtube.control.play) {
          setPrevPlayerControl(constants.youtube.control.play);
          logger("[playerPlaybackEffect]playback controll", playerPlayback);
          playVideo();
        } else if (playerPlayback.control === constants.youtube.control.pause) {
          setPrevPlayerControl(constants.youtube.control.pause);
          logger("[playerPlaybackEffect]playback controll", playerPlayback);
          pauseVideo();
        }
      } else {
        // 영상이 변경되지 않았을 때
        // 포지션 변경이 일어났는지 먼저 체크
        if (
          playerPlayback.sender !== getCurrentUser()?.uid &&
          playerPlayback.position !== prevPosition
        ) {
          // 다른 유저가 db 업데이트시 prevPosition 값을 등록한다.
          // play 하기 전 progress 값으로 이동하기 때문에 sync 만 맞춰준다.
          setPrevPosition(playerPlayback.position as number);
          blockClicking();
          pauseVideo();
          syncProgress(
            progressTimer,
            0,
            ((playerPlayback.position as number) /
              (playerPlayback.lengthSeconds as number)) *
              100
          );
          // player.seekTo(playerPlayback.position as number, true)
          unblockClicking();
          playVideo();
        }
        // isDraggHappen? 을 만들어서 드래그 이벤트시 DB 업데이트해주자. 우리쪽 playerPlayback 의 position 역시 업데이트
        // 내가 플레이어를 변경한 경우 isPlayPauseChanged isDraggHappened
        if (isDraggHappened) {
          const newPosition = getProgressNowPosition();
          if (partyId) changePlayback(partyId, { position: newPosition });
          setIsDraggHappened(false);
        }
        if (isPlayClicked) {
          if (partyId)
            changePlayback(partyId, {
              control: constants.youtube.control.play,
            });
          setIsPlayClicked(false);
        }
        if (isPauseClicked) {
          if (partyId)
            changePlayback(partyId, {
              control: constants.youtube.control.pause,
            });
          setIsPauseClicked(false);
        }

        // 누군가가 플레이어를 변경한 경우 플레이어의 control 값과 비교한다.
        if (
          playerPlayback.control === constants.youtube.control.play &&
          playerPlayback.control !== prevPlayerControl
        ) {
          setPrevPlayerControl(constants.youtube.control.play);
          logger("[playerPlaybackEffect]playback controll", playerPlayback);
          // if (partyId)
          //   changePlayback(partyId,playerPlayback)
          playVideo();
        } else if (
          playerPlayback.control === constants.youtube.control.pause &&
          playerPlayback.control !== prevPlayerControl
        ) {
          setPrevPlayerControl(constants.youtube.control.pause);
          logger("[playerPlaybackEffect]playback controll", playerPlayback);
          pauseVideo();
        }
      }
    }
    // },[pauseVideo, playVideo, player, playerPlayback, prevPlayerControl, prevVideoId, progressTimer, syncProgress])
  }, [
    unblockClicking,
    blockClicking,
    getProgressNowPosition,
    isDraggHappened,
    isPauseClicked,
    isPlayClicked,
    partyId,
    pauseVideo,
    playVideo,
    player,
    playerPlayback,
    prevPlayerControl,
    prevPosition,
    prevVideoId,
    progressTimer,
    syncProgress,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const iframeHeightEffect = useEffect(() => {
    const iframeElem = document.getElementById("youtube-player");
    const detailDivElem = document.getElementById(
      "unclickable-youtube-wrapper-div"
    );
    if (iframeElem && detailDivElem) {
      logger(
        "iframeHeightEffect",
        detailDivElem.style.width,
        youtubeVideoDivWidthHeight
      );
      iframeElem.style.width = `${youtubeVideoDivWidthHeight.width}vw`;
      iframeElem.style.height = `${youtubeVideoDivWidthHeight.height}vh`;
      detailDivElem.style.height = `${youtubeVideoDivWidthHeight.height}vh`;
      // elem.style.height = `50vh` // 테스트할때만 사용
      // detailDivElem.style.height = `50vh`
      // if (sharedVideoPlayback?.width && sharedVideoPlayback?.height && sharedVideoPlayback?.width > sharedVideoPlayback?.height){
      // iframeElem.style.width = "100%"
      // }
    }
  }, [youtubeVideoDivWidthHeight]);
  // const videoId = video.id;
  const opts: Options = {
    // height: '390',
    // width: '1600',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // 1 auto play , 0 stop
      // cc_load_policy: 1,
      controls: 0,
      iv_load_policy: 3,
      // modestbranding:,
      origin: window.location.origin,
      disablekb: 1, //키보드 컨트롤 1 노응답
      rel: 0, // 관련 동영상 노 표시
    },
  };

  return (
    <YoutubeDetailStyle>
      <div id="youtube-wrapper-wrapper-div">
        {/* <div id="unclickable-div"> */}
        <div id="unclickable-youtube-wrapper-div">
          <YouTube
            id="youtube-player"
            videoId={videoId}
            // className={string}                // defaults -> null
            // containerClassName={string}       // defaults -> ''
            opts={opts as Options} // defaults -> {}
            // onReady={()=>{logger('onReady')}}                    // defaults -> noop
            onReady={_onReady} // defaults -> noop
            onPlay={() => {
              logger("onPlay");
              const playBtn = document.getElementById("img-player-play");
              const pauseBtn = document.getElementById("img-player-pause");
              playBtn?.classList.add("display-out");
              pauseBtn?.classList.remove("display-out");
            }} // defaults -> noop
            onPause={() => {
              logger("onPause");
              const playBtn = document.getElementById("img-player-play");
              const pauseBtn = document.getElementById("img-player-pause");
              playBtn?.classList.remove("display-out");
              pauseBtn?.classList.add("display-out");
            }} // defaults -> noop
            // onEnd={_onEnd} // defaults -> noop
            onError={() => {
              logger("onError");
            }} // defaults -> noop
            // onStateChange={_onStateChange} // defaults -> noop
            onPlaybackRateChange={() => {
              logger("onPlaybackRateChange");
            }} // defaults -> noop
            onPlaybackQualityChange={() => {
              logger("onPlaybackQualityChange");
            }} // defaults -> noop
          />
          <div id="youtube-bloking-div" className="display-out">
            blocking
          </div>
          {/* <img id="img-player-play" className="cursor-pointer pointer-event-possible" src={playerPlay}  alt="ic" onClick={playOnClick}/> */}
          <img
            id="img-player-play"
            className="cursor-pointer pointer-event-possible"
            src={constants.smoothy.images.youtubue.playerPlay}
            alt="ic"
            onClick={playOnClick}
          />
          {/* <img id="img-player-pause" className="cursor-pointer display-out pointer-event-possible" src={playerPause}  alt="ic" onClick={pauseOnClick}/> */}
          <img
            id="img-player-pause"
            className="cursor-pointer display-out pointer-event-possible"
            src={constants.smoothy.images.youtubue.playerStop}
            alt="ic"
            onClick={pauseOnClick}
          />
          {/* <img id="img-player-now" className="" src={progressNow}  alt="ic" onClick={()=>{}}/> */}
          {/* <div id="player-progress-bar-wrapper" className="cursor-pointer" onDragStart={nowDragStart} onDragOver={dragover} onDrop={drop} onDrag={()=>{logger("ondragg")}}> */}
          <div
            id="progress-container"
            className="cursor-pointer pointer-event-possible"
          >
            {/* <div id="img-player-now-wrapper" className="cursor-pointer pointer-event-possible" draggable="true" onDrag={nowOnDrag} onDragStart={nowOnDragStart} onDragEnd={nowOnDragEnd}> */}
            {/* <div id="player-progress-bar-wrapper" className="cursor-pointer pointer-event-possible" onDrag={nowOnDrag} onDragStart={nowOnDragStart} onDragEnd={nowOnDragEnd}> */}
            <div id="player-progress-bar-wrapper" draggable="false">
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
                  <circle cx="5.5" cy="5.5" r="5.5" fill="red" />
                </svg>
              </div>
              <LinearProgress
                id="player-progress-bar"
                draggable="false"
                color="secondary"
                variant="determinate"
                value={progress}
              />
            </div>
            <div className="fullscreen-horizontal-wrapper-div cursor-pointer pointer-event-possible">
              <img
                src={constants.smoothy.images.youtubue.fullscreenHorizontal}
                alt="fullscreen horizontal"
              />
            </div>
          </div>
        </div>
        <div className="details">
          {/* <div>{title}</div>
          <div>{description}</div> */}
        </div>
      </div>
    </YoutubeDetailStyle>
  );
}

export default React.memo(YoutubeVideoDetail);
// export default YoutubeVideoDetail;
