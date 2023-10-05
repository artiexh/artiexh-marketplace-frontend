import Image from "next/image";
import { SyntheticEvent, useEffect, useState } from "react";

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

const fallbackImage = "/imgs/img-placeholder.jpg";

type ImageWithFallbackProps = Omit<
  React.ComponentProps<typeof Image>,
  "src"
> & {
  fallback?: React.ComponentProps<typeof Image>["src"];
  src?: React.ComponentProps<typeof Image>["src"];
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
    return <Image alt={alt} src={fallback} {...props} />;
  }

  return (
    <Image
      alt={alt}
      onError={(e) => setError(e)}
      src={error ? fallback : src}
      {...props}
    />
  );
};

export default ImageWithFallback;
