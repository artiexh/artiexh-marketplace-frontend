import { ProductInSale } from "@/types/SaleCampaign";
import { TableColumns } from "@/types/Table";
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
          <img src={record.thumbnailUrl} alt="product-thumb" />
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
    render: (record) => <span>{record.price?.amount ?? "Chưa đăng ký"}</span>,
  },
  {
    title: "Lợi nhuận artist",
    dataIndex: "artistProfit",
    key: "artistProfit",
    className: "!text-center w-[10rem]",
    render: (record) => {
      return <span>{record.artistProfit ?? "Chưa đăng ký"}</span>;
    },
  },
  {
    title: "Trạng thái",
    key: "status",
    className: "!text-center w-[10rem]",
    render: (record) => <Badge>{record.status}</Badge>,
  },
  {
    title: "Action",
    key: "action",
    className: "!text-center",
    render: (record) => (
      <div className="flex justify-center gap-x-2">
        <div
          className="cursor-pointer border-blue-400 py-[3px] px-2 rounded-2xl text-xs bg-blue-400 text-white font-semibold"
          onClick={() => record.onEdit && record.onEdit(record)}
        >
          Edit
        </div>
        <div
          className={clsx(
            " py-[3px] px-2 rounded-2xl text-xs text-white font-semibold",
            record.onDelete
              ? "cursor-pointer border-red-500 bg-red-500"
              : "cursor-not-allowed bg-slate-400 border-slate-400"
          )}
          onClick={() => record.onDelete && record.onDelete(record)}
        >
          Remove
        </div>
      </div>
    ),
  },
];
