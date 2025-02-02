import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { Product } from "@/types/Product";
import { currencyFormatter } from "@/utils/formatter";
import clsx from "clsx";
import { useRouter } from "next/router";
import defaultImg from "../../../../../public/assets/default-thumbnail.jpg";
import styles from "./ProductPreviewCard.module.scss";
import { getCampaignType } from "@/utils/mapper";
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { remaniningQuantityThreshold } from "@/constants/common";

interface IProductPreviewCardProps {
  data: Product;
  className?: string;
}

const ProductPreviewCard = ({ data, className }: IProductPreviewCardProps) => {
  const router = useRouter();

  const campaignType = getCampaignType(data.saleCampaign);

  const campaignTypeData = CAMPAIGN_TYPE_DATA[campaignType];

  return (
    <div
      className={clsx(
        styles["product-preview-card"],
        "bg-white rounded-2xl !aspect-[3/5] w-full cursor-pointer shadow relative",
        className
      )}
      onClick={() =>
        router.push(`/product/${data.saleCampaign.id}_${data.productCode}`)
      }
    >
      {data.saleCampaign.type !== "SHARE" && (
        <div
          className={clsx(
            "absolute right-0 top-[5%] z-10 pl-2 pr-2 py-1 rounded-l-lg font-semibold text-sm !text-white",
            "bg-primary"
          )}
        >
          {data.saleCampaign.type === "PRIVATE"
            ? `Chỉ có ở Shop`
            : data.saleCampaign.type === "PUBLIC"
            ? "Chỉ có ở Arty"
            : null}
        </div>
      )}
      <div className="relative w-full aspect-square">
        <ImageWithFallback
          fallback="/assets/default-thumbnail.jpg"
          className="rounded-2xl rounded-b-none object-cover w-full h-full !max-w-[260px]"
          src={
            data?.thumbnailUrl?.includes("http")
              ? data?.thumbnailUrl
              : defaultImg.src
          }
          alt="dogtor"
        />
        {new Date(data.saleCampaign.from) <= new Date() &&
        new Date(data.saleCampaign.to) >= new Date() ? (
          data.quantity <= 0 ? (
            <div className="p-4 text-red-600 absolute top-20 w-full text-center bg-white opacity-80 font-semibold">
              Đã hết hàng
            </div>
          ) : data.quantity <= remaniningQuantityThreshold ? (
            <div className="bg-orange-400 text-sm absolute bottom-0 right-0 px-2 py-1 text-white font-semibold rounded-tl-md">
              Sắp cháy hàng!
            </div>
          ) : null
        ) : new Date(data.saleCampaign.to) <= new Date() ||
          data.saleCampaign.status === "CLOSED" ? (
          <div className="p-4 text-red-600 absolute  top-20 w-full text-center bg-white opacity-80 font-semibold">
            Chiến dịch đã kết thúc
          </div>
        ) : null}
      </div>
      <div className="p-2.5 sm:p-6 sm:text-base md:p-4 md:text-base md:leading-snug">
        <div className="font-semibold product-name">{data?.name}</div>
        <div className="text-slate-400 text-sm">{data?.owner?.displayName}</div>

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
