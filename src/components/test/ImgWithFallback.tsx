type ImgWithFallbackProps = {
  src:string,
  fallback:string,
  type?:string,
  alt?:string,
  usedRef?:number
}
export default function ImgWithFallback ({
  src,
  fallback,
  type = 'image/webp',
  ...delegated
}:ImgWithFallbackProps) {
  return (
    <picture>
      <source srcSet={src} type={type} />
      <img className="video" src={fallback} {...delegated} alt=""/>
    </picture>
  );
};