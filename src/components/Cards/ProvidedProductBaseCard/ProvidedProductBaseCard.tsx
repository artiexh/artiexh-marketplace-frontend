import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { Price } from "@/types/Product";
import { currencyFormatter } from "@/utils/formatter";
import clsx from "clsx";

export type ProvidedProductBase = {
  id: string;
  name: string;
  description: string;
  minPrice: Price;
  type: "SINGLE";
  thumbnail: string;
  model: string;
};

export type CollectionProductBase = Omit<
  ProvidedProductBase,
  "model" | "type"
> & {
  type: "COLLECTION";
  items: ProvidedProductBase[];
};

type ProvidedProductBaseCardProps = {
  data: ProvidedProductBase | CollectionProductBase;
  className?: string;
  actions?: React.ReactNode;
};

export default function ProvidedProductBaseCard({
  data,
  className,
  actions,
}: ProvidedProductBaseCardProps) {
  return (
    <div className={clsx("bg-white rounded-2xl aspect-3/5 w-full", className)}>
      <div className="relative w-full aspect-square">
        <ImageWithFallback
          fallback="/assets/default-thumbnail.jpg"
          className=" rounded-2xl rounded-bl-none object-cover"
          src={"/assets/carue.png"}
          alt="dogtor"
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
        />
      </div>
      <div className="p-2.5 sm:p-6 sm:text-xl md:p-4 md:text-xl">
        <div className="font-semibold">{data?.name}</div>
        <div className="text-slate-400 text-base whitespace-nowrap text-ellipsis overflow-hidden">
          {data.description}
        </div>
        <div className="text-right mt-2.5 md:mt-6 font-semibold">
          {isNaN(Number(data.minPrice.amount))
            ? "N/A"
            : currencyFormatter(data.minPrice.amount)}
        </div>
      </div>
      <div className="action-group">{actions}</div>
    </div>
  );
}
