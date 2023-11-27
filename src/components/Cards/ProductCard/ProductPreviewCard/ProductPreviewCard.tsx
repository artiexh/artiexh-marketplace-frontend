import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { Product } from "@/types/Product";
import { currencyFormatter } from "@/utils/formatter";
import clsx from "clsx";
import { useRouter } from "next/router";
import defaultImg from "../../../../../public/assets/default-thumbnail.jpg";
import styles from "./ProductPreviewCard.module.scss";

interface IProductPreviewCardProps {
  data: Product;
  className?: string;
}

const ProductPreviewCard = ({ data, className }: IProductPreviewCardProps) => {
  const router = useRouter();
  return (
    <div
      className={clsx(
        styles["product-preview-card"],
        "bg-white rounded-2xl !aspect-[3/5] w-full cursor-pointer shadow",
        className
      )}
      onClick={() =>
        router.push(`/product/${data.saleCampaign.id}_${data.productCode}`)
      }
    >
      <div className="relative w-full aspect-square">
        <ImageWithFallback
          fallback="/assets/default-thumbnail.jpg"
          className="rounded-2xl rounded-b-none object-cover w-full h-full"
          src={
            data?.thumbnailUrl?.includes("http")
              ? data?.thumbnailUrl
              : defaultImg.src
          }
          alt="dogtor"
        />
      </div>
      <div className="p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-lg md:leading-snug">
        <div className="font-semibold product-name">{data?.name}</div>
        <div className="text-slate-400 text-base">
          {data?.owner?.displayName}
        </div>
        <div className="text-right mt-2.5 md:mt-6 font-semibold">
          {isNaN(data.price.amount)
            ? "N/A"
            : currencyFormatter(data.price.amount)}
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewCard;
