import {
  VolumeMute,
  VolumeOff,
  VideocamOff,
  Videocam,
} from "@material-ui/icons";
import logger from "../../lib/custom-logger/logger";
import { onOffTrack } from "../../lib/twilio";

type VideoChatIconProps = {
  identity:string
};
function VideoChatIcon({identity}:VideoChatIconProps) {
  const onVideoClick = (e:React.MouseEvent<SVGSVGElement>,value:boolean) => {
    logger('onVideoClick clicked')
    onOffTrack(identity,'video',value)
  }
  const onVolumeClick = (e:React.MouseEvent<SVGSVGElement>,value:boolean) => {
    logger('onVolumeClick clicked')
    onOffTrack(identity,'audio',value)
  }
  return (
    <>
      <VideocamOff
        style={{ position: "absolute", bottom: 0, left: 0, zIndex: 10 ,}}// border: "1px solid white" , boxSizing: "border-box"}}
        className="video-off"
        onClick={(e)=>onVideoClick(e,false)}
      />
      <Videocam
        style={{ position: "absolute", bottom: 0, left: 20, zIndex: 10 ,}}//border: "1px solid white" , boxSizing: "border-box"}}
        className="video-on"
        onClick={(e)=>onVideoClick(e,true)}
      />
      <VolumeOff
        style={{ position: "absolute", bottom: 0, left: 40, zIndex: 10 ,}}//border: "1px solid white" , boxSizing: "border-box" }}
        className="audio-off"
        onClick={(e) => onVolumeClick(e , false)}
      />
      <VolumeMute
        style={{ position: "absolute", bottom: 0, left: 60, zIndex: 10 ,}}//border: "1px solid white" , boxSizing: "border-box"}}
        className="audio-on"
        onClick={(e) => onVolumeClick(e , true)}
      />
    </>
  );
}

export default VideoChatIcon;
