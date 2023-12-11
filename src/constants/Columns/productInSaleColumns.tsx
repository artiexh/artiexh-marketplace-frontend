import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { ProductInSale } from "@/types/SaleCampaign";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";
import { Badge } from "@mantine/core";

import clsx from "clsx";

export const productInSaleColumns: TableColumns<
  ProductInSale & {
    onEdit?: (data: ProductInSale) => void;
    onDelete?: (data: ProductInSale) => void;
  }
> = [
  {
    title: "Sản phẩm",
    key: "product",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <ImageWithFallback
            className="object-cover w-full h-full"
            src={record.thumbnailUrl}
            alt="product-thumb"
          />
        </div>
        <div className="flex flex-col">
          <span>Code: {record.productCode}</span>
          <span className="text-gray-500 text-sm">Name: {record.name}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Hàng trong kho",
    dataIndex: "inventoryQuantity",
    key: "inventoryQuantity",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Số lượng bán",
    dataIndex: "quantity",
    key: "quantity",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Giá bán",
    dataIndex: "price",
    key: "price",
    className: "!text-center w-[10rem]",
    render: (record) => (
      <span>{currencyFormatter(record.price?.amount) ?? "Chưa đăng ký"}</span>
    ),
  },
  {
    title: "Lợi nhuận artist",
    dataIndex: "artistProfit",
    key: "artistProfit",
    className: "!text-center w-[10rem]",
    render: (record) => {
      return (
        <span>{currencyFormatter(record.artistProfit) ?? "Chưa đăng ký"}</span>
      );
    },
  },
  {
    title: "Trạng thái",
    key: "status",
    className: "!text-center w-[10rem]",
    render: (record) => <Badge>{record.status}</Badge>,
  },
];
