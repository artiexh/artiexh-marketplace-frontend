import { SimpleDesignItem } from "@/types/DesignItem";
import clsx from "clsx";
import { DOMAttributes } from "react";

type DesignItemCardProps = {
  data: SimpleDesignItem;
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
        <div className="w-20 aspect-square bg-primary rounded-md" />
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-y-1">
            <div className="text-2xl font-semibold">{data.name}</div>
            <div>
              <span>Product base: {data.variant.productBase.name}</span>
            </div>
          </div>
          <div className="actions flex justify-end">{actions}</div>
        </div>
      </div>
    </div>
  );
}
