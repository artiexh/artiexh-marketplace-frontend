import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import { SimpleCustomProduct } from "@/types/CustomProduct";
import { Card, Paper } from "@mantine/core";
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
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      onClick={onClick}
      className={clsx(classNames?.root)}
    >
      <div className="size-description flex gap-x-3">
        <div className="w-20 h-20 relative rounded-md">
          <PrivateImageLoader
            className="rounded-md object-cover w-full h-full"
            id={data.modelThumbnail?.id.toString()}
            alt="test"
          />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-y-1">
            <div className="w-full flex justify-between">
              <div className="text-xl font-semibold">{data.name}</div>
              <div className="actions flex justify-end">{actions}</div>
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="text-base">
                Template: {data.variant.productTemplate.name}
              </div>

              <div className="text-xs text-gray-500">
                Variant:{" "}
                {data.variant.variantCombinations.reduce(
                  (prev, combination) => {
                    if (!combination.optionValue)
                      return prev + `${combination.option.name}: N/A; `;

                    return (
                      prev +
                      `${combination.option.name}: ${combination.optionValue.name}; `
                    );
                  },
                  ""
                ) || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
