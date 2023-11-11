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

  return <ImageWithFallback {...rest} src={data} />;
}

import Image from "next/image";
import { SyntheticEvent, useEffect, useState } from "react";

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

const fallbackImage = "/assets/default-thumbnail.jpg";

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
    <img
      alt={alt}
      onError={(e) => setError(e)}
      src={error ? fallback : src}
      {...props}
    />
  );
};
