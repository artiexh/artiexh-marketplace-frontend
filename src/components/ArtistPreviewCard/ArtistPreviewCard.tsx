/* eslint-disable @next/next/no-img-element */
import { Artist } from "@/types/User";
import clsx from "clsx";
import { useRouter } from "next/router";
import styles from "../Cards/ProductCard/ProductPreviewCard/ProductPreviewCard.module.scss";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

export default function ArtistPreviewCard({ artist }: { artist: Artist }) {
  const router = useRouter();

  return (
    <div
      className={clsx(
        styles["product-preview-card"],
        "bg-white rounded-2xl !aspect-[3/5] w-full cursor-pointer shadow"
      )}
      onClick={() => router.push(`/shop/${artist.username}/home`)}
    >
      <div className="relative w-full aspect-square">
        <ImageWithFallback
          src={artist.avatarUrl}
          alt="dogtor"
          className="rounded-2xl rounded-b-none object-cover w-full h-full"
        />
      </div>
      <div className="p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-lg md:leading-snug">
        <div className="font-semibold product-name">{artist?.displayName}</div>
      </div>
    </div>
  );
}
