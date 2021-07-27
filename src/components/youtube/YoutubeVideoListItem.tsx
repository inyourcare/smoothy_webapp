import styled from "styled-components";
import { YoutubeVideoType } from "./types";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { RootState } from "../../modules";
import { useSelector } from "react-redux";
import { useStyles } from "../common/CustomStyle";

const YoutubeVideoListItemStyle = styled.div`
  /* width: 100%; */
  .youtube-thumbnail {
    width: 100%;
    height: 100%;
    /* max-width: 120px; */
  }
  .youtube-thumbnail-div {
    width: 40%;
    height: 60px;
    margin-right: 5%;
    max-width: 120px;
  }
  .sender-profile-div {
    display: flex;
    flex-wrap: nowrap;
    justify-content: left;
    align-items: center;
  }
  .youtube-description-div {
    width:60%
  }
  .video-title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2em; // 한줄 높이
    height: 2.4em; // 두 줄 이상이면 hidden
    /* max-height: 50px; */
    /* word-wrap:break-word;  */
    /* white-space: nowrap; */
    text-align: left;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;
type YoutubeVideoListItemProps = {
  video: YoutubeVideoType;
  onVideoSelect: (video: YoutubeVideoType) => void;
};
function YoutubeVideoListItem({
  video,
  onVideoSelect,
}: YoutubeVideoListItemProps) {
  const { buttonDisable } = useSelector((state: RootState) => state.smoothy);
  const imageUrl = video.thumbnail;
  const classes = useStyles();
  return (
    <YoutubeVideoListItemStyle>
      <ListItem className={classes.youtubueListItem}>
        <Button
          onClick={() => onVideoSelect(video)}
          fullWidth
          disabled={buttonDisable}
        >
          <div className="youtube-thumbnail-div">
            <img className="youtube-thumbnail" src={imageUrl} alt="thumbnail" />
          </div>
          {/* <ListItemText primary={video.title} secondary={video.sender} /> */}
          <div className="youtube-description-div">
            {/* <Typography
              align="left"
              variant="subtitle1"
              className="video-title"
            > */}
            <div className="video-title">
              <h6>
              {video.title + "dasdsad"}
              {/* {"후후하하"} */}
              </h6>
            </div>
            {/* </Typography> */}
            <div className="sender-profile-div">
              <Avatar
                src={video.senderProfile?.photoUriString}
                sizes="10px"
                className={classes.profileImg}
              >
                {/* <img
                  src={video?.profileImageUrl}
                  alt="profile"
                  // className={classes.avatarImg}
                /> */}
              </Avatar>
              <Typography align="left" noWrap variant="caption" className={classes.capitalize}>
                {video.senderProfile?.username}
              </Typography>
            </div>
          </div>
        </Button>
      </ListItem>
      {/* </li> */}
    </YoutubeVideoListItemStyle>
  );
}

export default YoutubeVideoListItem;
