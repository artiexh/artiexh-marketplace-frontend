import { Product } from "@/types/Product";
import { Divider } from "@mantine/core";
import { FC, useState } from "react";

type DescriptionProps = {
  description?: string;
  product: Product;
};

const Description: FC<DescriptionProps> = ({ description, product }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="description-wrapper shadow flex-1 card order-1 md:order-none col-span-12 md:col-span-7 p-0 pb-4 h-fit">
      <div className="meta-section mt-4 px-5">
        <div className="font-semibold">Chi tiết sản phẩm</div>
        <div className="mt-1 ">
          <div className="flex items-center justify-between">
            <div className=" text-gray-600">Mã sản phẩm</div>
            <div className=" text-gray-600">{product.productCode}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className=" text-gray-600">Loại sản phẩm</div>
            <div className=" text-gray-600">{product.category.name}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className=" text-gray-600">Mã chiến dịch</div>
            <div className=" text-gray-600">{product.saleCampaign.id}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className=" text-gray-600">Chiến dịch</div>
            <div className=" text-gray-600">{product.saleCampaign.name}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className=" text-gray-600">Loại chiến dịch</div>
            <div className=" text-gray-600">{product.saleCampaign.type}</div>
          </div>
        </div>
      </div>
      <div className="px-5 pt-5 transition-all duration-500">
        <div className="font-semibold">Mô tả</div>
        <div>
          {description
            ? showMore
              ? description
              : description
                  .split("\n")
                  .map((item) => <div key={item}>{item}</div>)
            : "Không có mô tả"}
        </div>
      </div>
    </div>
  );
};

export default Description;
