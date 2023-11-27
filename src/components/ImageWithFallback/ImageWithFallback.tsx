/* eslint-disable @next/next/no-img-element */
import { ImgHTMLAttributes, SyntheticEvent, useEffect, useState } from "react";

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

const fallbackImage = "/assets/default-thumbnail.jpg";

type ImageWithFallbackProps = Omit<ImgHTMLAttributes<any>, "src"> & {
  fallback?: ImgHTMLAttributes<any>["src"];
  src?: ImgHTMLAttributes<any>["src"];
};

const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<
    SyntheticEvent<HTMLImageElement, Event> | undefined
  >();

  useEffect(() => {
    setError(undefined);
  }, [src]);

  if (src === undefined || (typeof src === "string" && !isValidUrl(src))) {
    return <img alt={alt} src={fallback} {...props} />;
  }

  return (
    <img
      alt={alt}
      onError={(e) => setError(e)}
      src={error ? fallback : src}
      {...props}
    />
  );
};

export default ImageWithFallback;
