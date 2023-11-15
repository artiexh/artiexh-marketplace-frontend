import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { Shop } from "@/types/Shop";
import clsx from "clsx";
import { useRouter } from "next/router";
import defaultImg from "../../../public/assets/default-thumbnail.jpg";
import styles from "./ShopPreviewCard.module.scss";
import { ARTY_SHOP_USERNAME } from "@/constants/common";

export default function ShopPreviewCard({ shop }: { shop: Shop }) {
  const router = useRouter();
  return (
    <div
      className={clsx(
        styles["shop-preview-card"],
        "bg-white rounded-2xl aspect-3/5 w-full cursor-pointer"
      )}
      onClick={() =>
        router.push(
          `/shop/${
            shop.owner.username === ARTY_SHOP_USERNAME
              ? "arty-shop"
              : shop.owner.username
          }/home`
        )
      }
    >
      <div className="relative w-full aspect-square">
        <ImageWithFallback
          fallback="/assets/default-thumbnail.jpg"
          className="rounded-2xl rounded-bl-none object-cover"
          src={
            shop?.shopImageUrl?.includes("http")
              ? shop?.shopImageUrl
              : defaultImg
          }
          alt="dogtor"
          fill
          priority
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
      </div>
      <div className="p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-xl">
        <div className="font-semibold shop-name">{shop?.shopName}</div>
        <div className="text-slate-400 text-base">
          {shop?.owner?.displayName}
        </div>
      </div>
    </div>
  );
}
