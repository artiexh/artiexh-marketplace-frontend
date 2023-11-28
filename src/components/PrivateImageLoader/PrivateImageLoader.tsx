import { useQuery } from "@tanstack/react-query";

import { getPrivateFile } from "@/services/backend/services/media";

export default function PrivateImageLoader({
  id,
  ...rest
}: { id?: string } & React.ComponentProps<typeof ImageWithFallback>) {
  const { data, isLoading } = useQuery(["image", id], async () => {
    if (!id) return "";
    const res = await getPrivateFile(id);
    const buffer = Buffer.from(res.data, "binary").toString("base64");
    let image = `data:${res.headers["content-type"]};base64,${buffer}`;

    return image;
  });

  if (isLoading)
    return (
      <div className={rest.className}>
        <div className={clsx("relative w-full h-full")}>
          <LoadingOverlay
            visible={true}
            overlayBlur={2}
            loaderProps={{
              size: "sm",
            }}
          />
        </div>
      </div>
    );

  return <ImageWithFallback {...rest} src={data} />;
}

import Image from "next/image";
import { ImgHTMLAttributes, SyntheticEvent, useEffect, useState } from "react";
import clsx from "clsx";
import { Loader, LoadingOverlay } from "@mantine/core";

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

const fallbackImage = "/assets/default-thumbnail.jpg";

type ImageWithFallbackProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  fallback?: ImgHTMLAttributes<HTMLImageElement>["src"];
  src?: ImgHTMLAttributes<HTMLImageElement>["src"];
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
