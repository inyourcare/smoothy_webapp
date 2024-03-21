import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getYoutubeVideoInfoOembed } from "../../lib/api/posts";
import { youtubeDeactivatedCallback } from "../../lib/common/common";
import constants from "../../lib/common/constants";
import logger from "../../lib/custom-logger/logger";
import {
  YoutubePlayback,
  getCurrentUser
} from "../../lib/firebase";
import { RootState } from "../../modules";
import {
  AlertSeverityProvider,
  SET_ALERT_SNACKBAR,
  SET_PLAYBACK,
  SET_PLAYLIST,
  SET_SELECTED_VIDEO,
} from "../../modules/smoothy";
import { useStyles } from "../common/CustomStyle";
import YoutubeInputDialog from "./YoutubeInputDialog";
import YoutubePlayNowDialog from "./YoutubePlayNowDialog";
import YoutubeVideoList from "./YoutubeVideoList";
import { YoutubeVideoType } from "./types";

const YoutubeDrawerStyle = styled.div`
  .inner-drawer-container-div {
    width: 30vw;
  }
  #next-video-select-btn {
    background-color: skyblue;
  }
  .next-video-select-btn-div {
    position: absolute;
    bottom: 10%;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }
  .next-video-select-btn-not-started-div {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }
  #watch-party-not-started-main-img {
    width: 40%;
    height: 20%;
    object-fit: contain;
    overflow: hidden;
  }
  .watch-party-not-started-main-div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .watch-party-not-started-img-div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .full-width {
    width: 100%;
  }
`;
type YoutubeDrawerProps = {
  open: boolean;
  setOpen: (o: boolean) => void;
  partyId?: string;
};
// eslint-disable-next-line no-empty-pattern
function YoutubeDrawer({ partyId, open, setOpen }: YoutubeDrawerProps) {
  const classes = useStyles();
  const anchor = "left";
  // const [drawerOpen, setDrawerOpen] = useState(false);
  // const classes = useStyles();

  const dispatch = useDispatch();
  // const { youtubeMode } = useSelector((state: RootState) => state.smoothy);
  const { sharedVideoPlayback, playlist } = useSelector(
    (state: RootState) => state.smoothy.youtube
  );
  const { buttonDisable, videoChatUserProfiles } = useSelector(
    (state: RootState) => state.smoothy
  );
  const [prevVideoId, setPrevVideoId] = useState("");
  const [videos, setVideos] = useState([] as YoutubeVideoType[]);
  // const [selectedVideo, setSelectedVideo] = useState({
  //   id: "",
  // } as YoutubeVideoType);
  const [youtubeInputOpen, setYoutubeInputOpen] = useState(false);
  const [youtubePlayNowOpen, setYoutubePlayNowOpen] = useState(false);
  const [playNowDialogVideo, setPlayNowDialogVideo] = useState(
    undefined as unknown as YoutubeVideoType
  );
  const [loadingForAddVideoToPlaylist, setLoadingForAddVideoToPlaylist] =
    useState(false);

  // youtube link 추가시 동작
  const addVideoToPlaylist = useCallback(
    (url: string) => {
      setLoadingForAddVideoToPlaylist(true);
      // https://www.youtube.com/watch?v=xeul9fEvo-Q
      // const linkParsed = term.split("=");
      logger("[addVideoToPlaylist] link::", url);
      // if (linkParsed.length >= 2 && linkParsed[1]) {
      // getYoutubeVideoInfo(linkParsed[1].split("&")[0])
      // getYoutubeVideoInfo(url)
      getYoutubeVideoInfoOembed(url)
        .then(async function (data) {
          var newPlayback = data as YoutubePlayback;
          logger("[addVideoToPlaylist]newPlayback->", newPlayback);
          // newPlayback.control = constants.youtube.control.play
          // newPlayback.sender = getCurrentUser()?.uid as string
          // newPlayback.sendTimestamp = await getServerTime()
          // if (partyId) {
          if (false) {
            // 대화방 -> 내가 비디오를 먼저 shared 하려 한 경우
            logger("[addVideoToPlaylist]shared add playlist", newPlayback);
            // addVideoToPlayListFirestore(partyId, newPlayback);
          } else {
            // 테스트 또는 로컬의 경우
            logger("[addVideoToPlaylist]locally add playlist", newPlayback);
            newPlayback.control = constants.youtube.control.play
            dispatch({
              type: SET_PLAYLIST,
              payload: playlist?.concat(newPlayback) || [newPlayback],
            });
            // setVideos(
            //   Array.from(
            //     videos.concat({
            //       id: newPlayback.videoId,
            //       title: newPlayback.title,
            //       description: "no description",
            //       thumbnail: newPlayback.thumbnailUrl,
            //       // sender: newPlayback.sender
            //       sender: "yCwhjUn4Bpa0vEq12S3RHm4N50M2",
            //     } as YoutubeVideoType)
            //   )
            // );
          }
          setYoutubePlayNowOpen(true);
          setPlayNowDialogVideo({
            id: newPlayback.videoId,
            title: newPlayback.title,
            description: "no description",
            thumbnail: newPlayback.thumbnailUrl,
            // sender: newPlayback.sender
            sender: getCurrentUser()?.uid,
          } as YoutubeVideoType);
        })
        .catch(function (err) {
          logger("[addVideoToPlaylist]error::", err);
          // alert("watch party 가 불가능한 영상입니다.");
          dispatch({
            type: SET_ALERT_SNACKBAR,
            payload: {
              severity: AlertSeverityProvider.error,
              alertMessage: `watch party 가 불가능한 영상입니다.`,
            },
          });
        })
        .finally(() => {
          setLoadingForAddVideoToPlaylist(false);
        });
    },
    // }
    [dispatch, playlist]
  );

  const changePlayback = useCallback(
    (changes) => {
      let update = sharedVideoPlayback;
      if (changes.videoItem) {
        update = {
          videoListItemId: changes.videoItem,
          ...changes,
        };
      } else {
        update = {
          ...changes,
        };
      }
      dispatch({
        type: SET_PLAYBACK,
        payload: update as YoutubePlayback,
      });
    },
    [dispatch, sharedVideoPlayback]
  );

  const selectVideoFromList = useCallback(
    (video: YoutubeVideoType) => {
      // 내가 영상을 바꾸는 동작
      // playback 을 변경해야함
      // if (partyId) {
        const selected = playlist?.filter(
          (playItem) => playItem.videoId === video.id
        )[0];
        if (selected) {
          logger("[selectVideoFromList] change selected ", selected);
          // setSelectedVideo(video);
          dispatch({ type: SET_SELECTED_VIDEO, payload: video });
          selected.control = constants.youtube.control.play;
          selected.position = 0;
          // changePlayback(partyId, {
          changePlayback({
            ...selected,
            control: constants.youtube.control.play,
            position: 0,
          });
        }
      // } else {
      //   // local test
      //   const selected = videos?.filter(
      //     (playItem) => playItem.id === video.id
      //   )[0];
      //   dispatch({ type: SET_SELECTED_VIDEO, payload: selected });
      //   // setSelectedVideo(selected);
      // }
    },
    [dispatch, partyId, playlist, videos]
  );
  const handleDialogOnClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const youtubeActivateDetectEffect = useEffect(() => {
    if (
      partyId &&
      sharedVideoPlayback &&
      prevVideoId !== sharedVideoPlayback?.videoId
    ) {
      // shared 가 있고 prev 아이디가 shared 의 videoId 와 다르다 => 상대가 또는 내가 유튜브를 시작했거나 영상을 바꿨다.
      // setSelectedVideo({
      //   id: sharedVideoPlayback.videoId as string,
      //   title: sharedVideoPlayback.title,
      // });
      dispatch({
        type: SET_SELECTED_VIDEO,
        payload: {
          id: sharedVideoPlayback.videoId as string,
          title: sharedVideoPlayback.title,
        },
      });
      setPrevVideoId(sharedVideoPlayback.videoId as string);
    }
  }, [dispatch, partyId, prevVideoId, sharedVideoPlayback]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const playlistEffect = useEffect(() => {
    // if (partyId && playlist) {
    if (playlist) {
      setVideos(
        playlist.map((playItem) => {
          return {
            id: playItem.videoId,
            title: playItem.title,
            description: "no description",
            thumbnail: playItem.thumbnailUrl,
            sender: playItem.sender,
            senderProfile: videoChatUserProfiles.get(playItem.sender as string),
          } as YoutubeVideoType;
        })
      );
      // } else if (partyId && !playlist) {
    } else {
      setVideos([]);
    }
  }, [playlist, partyId, videoChatUserProfiles]);
  return (
    <YoutubeDrawerStyle>
      <Drawer
        anchor={anchor}
        open={open}
        // onClose={() => dispatch({ type: DEACTIVATE_YOUTUBE })}
        onClose={handleDialogOnClose}
        variant="persistent"
      >
        <div className="inner-drawer-container-div">
          {videos.length > 0 ? (
            // 이미 비디오가 있는 경우
            <>
              <List dense>
                <ListItem key={"close drawer"}>
                  <ListItemIcon>
                    <ArrowBackIosIcon
                      // onClick={() => dispatch({ type: DEACTIVATE_YOUTUBE })}
                      onClick={handleDialogOnClose}
                      // style={{ backgroundColor: "skyblue", cursor: "pointer" }}
                      style={{ cursor: "pointer" }}
                    />
                    {/* <ListItemText primary={"설정"} /> */}
                  </ListItemIcon>
                  {"워치파티 재생목록"}
                </ListItem>

                <YoutubeVideoList
                  // onVideoSelect={setSelectedVideo}
                  onVideoSelect={selectVideoFromList}
                  videos={videos}
                />
              </List>

              <div className="next-video-select-btn-div">
                {loadingForAddVideoToPlaylist ? (
                  <Typography align="center" noWrap>
                    영상을 파싱하는 중...
                  </Typography>
                ) : (
                  <>
                    <Button
                      id="next-video-select-btn"
                      onClick={() => {
                        setYoutubeInputOpen(!youtubeInputOpen);
                      }}
                      disabled={buttonDisable || loadingForAddVideoToPlaylist}
                      className={`${classes.root}`}
                      variant="contained"
                    >
                      <Typography align="center" noWrap>
                        다음 영상 고르기
                      </Typography>
                    </Button>

                    <Button
                      id="next-video-select-btn"
                      onClick={() => {
                        youtubeDeactivatedCallback();
                        handleDialogOnClose();
                      }}
                      disabled={buttonDisable || loadingForAddVideoToPlaylist}
                      className={`${classes.root}`}
                      variant="contained"
                    >
                      <Typography align="center" noWrap>
                        워치파티 종료
                      </Typography>
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            // 워치파티를 아직 실행하지 않은 경우
            <>
              <List dense>
                <ListItem key={"close drawer"}>
                  <ListItemIcon>
                    <ArrowBackIosIcon
                      // onClick={() => dispatch({ type: DEACTIVATE_YOUTUBE })}
                      onClick={handleDialogOnClose}
                      // style={{ backgroundColor: "skyblue", cursor: "pointer" }}
                      style={{ cursor: "pointer" }}
                    />
                    {/* <ListItemText primary={"설정"} /> */}
                  </ListItemIcon>
                  {"워치파티"}
                </ListItem>

                <div className="watch-party-not-started-main-div">
                  <div className="watch-party-not-started-img-div">
                    <img
                      src={
                        constants.smoothy.images.youtubue.watchPartySmoothyMon
                      }
                      alt="sample img"
                      id="watch-party-not-started-main-img"
                    />
                  </div>
                  <div className="full-width">
                    <Typography align="center" variant="h6">
                      새 워치파티 시작
                    </Typography>
                  </div>
                  <div className="full-width">
                    <Typography align="center">
                      친구들과 유튜브를 함께 볼 수 있어요 <br />
                    </Typography>
                  </div>
                </div>
              </List>
              <div className="next-video-select-btn-not-started-div">
                {loadingForAddVideoToPlaylist ? (
                  <Typography align="center" noWrap>
                    영상을 파싱하는 중...
                  </Typography>
                ) : (
                  <>
                    <Button
                      id="next-video-select-btn"
                      onClick={() => {
                        setYoutubeInputOpen(!youtubeInputOpen);
                      }}
                      disabled={buttonDisable || loadingForAddVideoToPlaylist}
                      className={`${classes.root}`}
                      variant="contained"
                    >
                      <Typography align="center" noWrap>
                        다음 영상 고르기
                      </Typography>
                    </Button>

                    <Button
                      id="next-video-select-btn"
                      onClick={() => {
                        youtubeDeactivatedCallback();
                        handleDialogOnClose();
                      }}
                      disabled={buttonDisable || loadingForAddVideoToPlaylist}
                      className={`${classes.root}`}
                      variant="contained"
                    >
                      <Typography align="center" noWrap>
                        워치파티 종료
                      </Typography>
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </Drawer>
      {/* </React.Fragment> */}
      <YoutubeInputDialog
        open={youtubeInputOpen}
        setOpen={setYoutubeInputOpen}
        addVideo={addVideoToPlaylist}
      />
      <YoutubePlayNowDialog
        open={youtubePlayNowOpen}
        setOpen={setYoutubePlayNowOpen}
        video={playNowDialogVideo}
        setVideo={setPlayNowDialogVideo}
        onVideoSelect={selectVideoFromList}
        // playVideoNow={playVideoNow}
      />
    </YoutubeDrawerStyle>
  );
}

export default YoutubeDrawer;
