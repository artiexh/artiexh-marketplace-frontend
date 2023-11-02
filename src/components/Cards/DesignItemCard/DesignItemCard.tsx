import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import clsx from "clsx";
import { DOMAttributes } from "react";

type DesignItemCardProps = {
  data: SimpleCustomProduct;
  onClick?: DOMAttributes<HTMLDivElement>["onClick"];
  classNames?: {
    root?: string;
  };
  actions?: React.ReactNode;
};

export default function DesignItemCard({
  data,
  onClick,
  classNames,
  actions,
}: DesignItemCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white rounded-md p-3.5 cursor-pointer",
        classNames?.root
      )}
    >
      <div className="size-description flex gap-x-3">
        <div className="w-20 aspect-square relative rounded-md">
          <PrivateImageLoader
            id={data.modelThumbnail?.id.toString()}
            alt="test"
            fill
          />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-y-1">
            <div className="text-2xl font-semibold">{data.name}</div>
            <div>
              <span>Product base: {data.variant.productTemplate.name}</span>
            </div>
          </div>
          <div className="actions flex justify-end">{actions}</div>
        </div>
      </div>
    </div>
  );
}
