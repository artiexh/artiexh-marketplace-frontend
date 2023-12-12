import { OwnerInfo, ShopInfo } from "@/types/Product";
import { FC, HTMLAttributes } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { ARTY_SHOP_USERNAME } from "@/constants/common";
import { User } from "@/types/User";

type ArtistInfoProps = HTMLAttributes<HTMLDivElement> & {
  artist: User;
};

const ShopCard: FC<ArtistInfoProps> = ({ artist, className, ...rest }) => {
  console.log(artist);
  const router = useRouter();
  return (
    <div
      className={clsx(
        "rounded-lg md:rounded-full p-5 bg-white flex h-max items-center justify-between gap-2",
        className
      )}
      {...rest}
    >
      <div className="flex items-center">
        <div>
          <Image
            className="aspect-square rounded-full"
            src={
              artist.avatarUrl ??
              "https://cdn.hero.page/pfp/5e92df9f-2fe9-4b7e-a87a-ba503fe458d2-charming-sakura-inspired-avatar-kawaii-anime-avatar-creations-1.png"
            }
            width={100}
            height={100}
            alt="shop-card"
          />
        </div>
        <div className="flex flex-col ml-5">
          <h3 className="text-2xl font-bold">{artist.displayName}</h3>
          <span className="text-gray-500 text-xl">@{artist.username}</span>
        </div>
      </div>
      <div
        className="cursor-pointer text-primary"
        onClick={() =>
          router.push(
            `/shop/${
              artist.username === ARTY_SHOP_USERNAME
                ? "arty-shop"
                : artist.username
            }/home`
          )
        }
      >
        View shop
      </div>
    </div>
  );
};

export default ShopCard;
