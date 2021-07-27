import styled from "styled-components";
import { YoutubeVideoType } from "./types";
import YoutubeVideoListItem from "./YoutubeVideoListItem";
import List from "@material-ui/core/List";
import { useStyles } from "../common/CustomStyle";

const YoutubeVideoListStyle = styled.div`
  /* overflow: auto; */
`;
type YoutubeVideoListProps = {
  videos: YoutubeVideoType[];
  onVideoSelect: (video: YoutubeVideoType) => void;
};
function YoutubeVideoList({ videos, onVideoSelect }: YoutubeVideoListProps) {
  var index = 0;
  const classes = useStyles();
  const videoItems = videos.map((video) => {
    return (
      <YoutubeVideoListItem
        onVideoSelect={onVideoSelect}
        // key={video.id + new Date().getTime()}
        key={index++}
        video={video}
      />
    );
  });
  return (
    // {/* <ul className = "col-md-4 list-group"> */}
    <ul>
      <YoutubeVideoListStyle>
        <List className={classes.youtubeList}>{videoItems}</List>
      </YoutubeVideoListStyle>
    </ul>
  );
}

export default YoutubeVideoList;
