import { ArtistInfo } from "@/types/Product";
import { FC, HTMLAttributes } from "react";
import { Rating } from "@mantine/core";
import clsx from "clsx";
import Badge from "@/components/Badge/Badge";

type ArtistInfoProps = HTMLAttributes<HTMLDivElement> & {
  artist: ArtistInfo;
};

const ShopCard: FC<ArtistInfoProps> = ({ artist, className, ...rest }) => {
  return (
    <div
      className={clsx(
        "rounded-lg md:rounded-full p-5 bg-white flex h-max",
        className
      )}
      {...rest}
    >
      <div className="w-20 gradient aspect-square rounded-full"></div>
      <div className="flex flex-col ml-5">
        <h3 className="text-2xl font-bold">{artist.displayName}</h3>
        <span className="text-gray-500 text-xl">@{artist.username}</span>
      </div>
    </div>
  );
};

export default ShopCard;
