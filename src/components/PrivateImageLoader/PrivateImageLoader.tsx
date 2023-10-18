import { useQuery } from "@tanstack/react-query";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
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
