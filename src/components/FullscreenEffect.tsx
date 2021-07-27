import logger from "../lib/custom-logger/logger";

// 안쓰는 컴포넌트긴한데 남겨두자 일단
type FullscreenEffectProps = {
  reactionId: string;
  type?: string;
};
function FullscreenEffect({
  reactionId,
  type = "image/webp",
  ...delegated
}: FullscreenEffectProps) {
  logger("FullscreenEffect component");
  const imgId = reactionId + Date.now().toString();
  const src = `${process.env.PUBLIC_URL}/smoothy-effect-resource/reaction/${reactionId}/${reactionId}.webp?${imgId}`;
  return (
    <>
      <img className="video" src={src} itemType={type} {...delegated} alt="fullscreen effect"/>
    </>
  );
}

export default FullscreenEffect;
