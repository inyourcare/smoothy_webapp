import { useState } from "react";
import styled from "styled-components";
// import { ACTIVATE_YOUTUBE, DEACTIVATE_YOUTUBE } from "../../modules/smoothy";
import YoutubeDrawer from "../youtube/YoutubeDrawer";
import YoutubeVideoDetail from "../youtube/YoutubeVideoDetail";
import { LinearProgress } from "@material-ui/core";
import { useEffect } from "react";
import constants from "../../lib/common/constants";
import { useDispatch } from "react-redux";
import { SET_YOUTUBE_DIV_WITH_HEIGHT } from "../../modules/smoothy";
import { timeConverter } from "../../lib/util/timeUtils";
const YoutubeTestStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 5px solid yellow; */
  box-sizing: border-box;
  /* margin-top: 40%; */
  flex-wrap: wrap;

  #progress-container-test {
    /* border: 10px solid gray; */
    box-sizing: border-box;
    position: absolute;
    /* bottom:30px; */
    left: 0;
    width: 100%;
    /* cursor: pointer; */
    height: 100px;

    display: flex;
    align-items: center;
    background-color: aquamarine;

    /* display: flex; */
    flex-wrap: nowrap;
  }
  #img-player-now-wrapper-test {
    // 여기 변경 사항은 아래 js 에도 바꿔줘야함
    fill: red;
    position: absolute;
    /* bottom:15%; */
    /* transform: translate(-50%,-6.5px); // px 로 계산하는게 맞을수도 일단 now 의 크기가 11 이라 6.5 로 함 추후 문제있으면 더 생각하자 */
    /* height: 100px; // svg 파일 크기에 맞춰야함 */
    /* top:-50%; */
    /* left: 0%; */
    /* transform: translate(-50%, -50%); */
    /* cursor: pointer; */
    display: flex;
    justify-content: center;
    align-items: center;

    left: 100%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  #player-progress-bar-wrapper-test {
    /* position: absolute; */
    position: relative;
    width: 100%;
    /* display: flex; */
    /* align-items: center; */
    /* z-index: ${constants.smoothy.zidx.blocking+10}; */
  }
  #fullscreen-horizontal-wrapper-div {
    /* width: 20%; */
  }
`;

type YoutubeTestProps = {};
// eslint-disable-next-line no-empty-pattern
function YoutubeTest({}: YoutubeTestProps) {
  // const { youtubeMode } = useSelector((state: RootState) => state.smoothy);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const dispatch = useDispatch()

  // const toggleYoutubeMode = useCallback(() => {
  //   if (youtubeMode === true) {
  //     logger("EffectButtonSpace deactivate");
  //     dispatch({ type: DEACTIVATE_YOUTUBE });
  //   } else dispatch({ type: ACTIVATE_YOUTUBE });
  // }, [dispatch, youtubeMode]);
  useEffect(() => {
    // const now = document.getElementById('img-player-now-wrapper-test') as unknown as SVGElement
    //   now.style.left = `50%`
    dispatch({type:SET_YOUTUBE_DIV_WITH_HEIGHT,payload:{width:100,height:50}})
    return ()=>{dispatch({type:SET_YOUTUBE_DIV_WITH_HEIGHT,payload:{width:0,height:0}})}
  }, [dispatch]);
  return (
    <>
      {/* {youtubeMode === true ? (
        <>
        <YoutubeView partyId={""} />
        <button onClick={toggleYoutubeMode}>youtube</button>
        </>
      ) : (
        <YoutubeTestStyle>
          <button onClick={toggleYoutubeMode}>youtube</button>
        </YoutubeTestStyle>
      )} */}
      <YoutubeTestStyle>
        <div
          style={{
            // maxWidth: "640px",
            maxWidth: "100%",
            width: "100%",
            height: `50vh`,
            backgroundColor: "green",
            // height: getHeightForVideoSpace(actualUsers.length),
          }}
        >
          <YoutubeVideoDetail
            // videoId={"deYCI3AnTLA"} // 가로
            videoId={"WqOYy5SOaZM"} // 세로
            title={"title"}
            description={"description"}
            // _onReady={onReadyForYTDetail}
            // _onEnd={onEndForYTDetail}
            // _onStateChange={onStateChangeForYTDetail}
            // player={player}
            partyId={undefined}
          />
        </div>
        <div>
          <button
            onClick={() => {
              setYoutubeDialogOpen(!youtubeDialogOpen);
            }}
          >
            youtube
          </button>
          {timeConverter(Number(1619590336))}<br/>
          {new Date(1619590336).getTime()}<br/>
          {new Date().getTime()}
          <div id="progress-container-test">
            {/* <div id="img-player-now-wrapper" className="cursor-pointer pointer-event-possible" draggable="true" onDrag={nowOnDrag} onDragStart={nowOnDragStart} onDragEnd={nowOnDragEnd}> */}

            {/* <div id="player-progress-bar-wrapper" className="cursor-pointer pointer-event-possible" onDrag={nowOnDrag} onDragStart={nowOnDragStart} onDragEnd={nowOnDragEnd}> */}
            <div id="player-progress-bar-wrapper-test" draggable="false">
              <div id="img-player-now-wrapper-test" draggable="true">
                <svg
                  id="img-player-now-test"
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  fill="none"
                  viewBox="0 0 11 11"
                >
                  <circle
                    id="img-player-now-circle-test"
                    cx="5.5"
                    cy="5.5"
                    r="5.5"
                    fill="red"
                  />
                </svg>
              </div>
              <LinearProgress
                id="player-progress-bar-test"
                draggable="false"
                color="secondary"
                variant="determinate"
                value={50}
              />
            </div>
            <div
              id="fullscreen-horizontal-wrapper-div"
              className="cursor-pointer pointer-event-possible"
            >
              <img
                src={constants.smoothy.images.youtubue.fullscreenHorizontal}
                alt="fullscreen horizontal"
              />
            </div>
          </div>
        </div>
        {/* <button onClick={()=>getYoutubeVideoInfoOembed("https://www.youtube.com/watch?v=KaOzQqE-fwQ&list=RDqDcNn9C9e-Q&index=2")}>api test</button> */}
        {/* <button onClick={()=>getYoutubeVideoInfoOembed("https://youtu.be/KaOzQqE-fwQ")}>api test</button> */}
        {/* <button onClick={()=>getYoutubeVideoInfo("https://youtu.be/KaOzQqE-fwQ")}>api test</button> */}
        <YoutubeDrawer
          open={youtubeDialogOpen}
          setOpen={setYoutubeDialogOpen}
        />
      </YoutubeTestStyle>
    </>
  );
}
export default YoutubeTest;
