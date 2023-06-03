import Image from "next/image";
import styles from "./ProductPreviewCard.module.scss";
import { Product } from "@/types/Product";

interface IProductPreviewCardProps {
  data?: Product;
}

const ProductPreviewCard = ({ data }: IProductPreviewCardProps) => {
  return (
    <div
      className={`${styles["product-preview-card"]} bg-white rounded-2xl aspect-3/5 min-w-42 w-full `}
    >
      <div className="relative w-full aspect-square">
        <Image
          className=" rounded-2xl rounded-bl-none object-cover"
          src={"/assets/carue.png"}
          alt="dogtor"
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
      </div>
      <div className="p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-xl">
        <div className="font-semibold">{data?.name}</div>
        <div className="text-slate-400 text-base">{data?.shop}</div>
        <div className="text-right mt-2.5 md:mt-6 font-semibold">
          {data?.price}
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewCard;
