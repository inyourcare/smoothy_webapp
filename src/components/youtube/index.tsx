import YoutubeDrawer from './YoutubeDrawer';

type YoutubeViewProps = {
  open:boolean;
  setOpen:(o:boolean)=>void;
  partyId?: string;
}
export function YoutubeView({partyId, setOpen, open}:YoutubeViewProps) {
  return (
    <>
      {/* <YouTubeIFrame partyId={partyId}/> */}
      <YoutubeDrawer partyId={partyId} open={open} setOpen={setOpen}/>
    </>
  );
}

export default YoutubeView;