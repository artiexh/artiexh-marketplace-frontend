import { OwnerInfo, ShopInfo } from "@/types/Product";
import { FC, HTMLAttributes } from "react";
import clsx from "clsx";
import Image from "next/image";

type ArtistInfoProps = HTMLAttributes<HTMLDivElement> & {
  artist: ShopInfo;
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
      <div>
        <Image
          className="aspect-square rounded-full"
          src={artist.shopImageUrl}
          width={100}
          height={100}
          alt="shop-card"
        />
      </div>
      <div className="flex flex-col ml-5">
        <h3 className="text-2xl font-bold">{artist.shopName}</h3>
        <span className="text-gray-500 text-xl">
          @{artist.owner.displayName}
        </span>
      </div>
    </div>
  );
};

export default ShopCard;
