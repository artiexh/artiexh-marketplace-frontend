import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { OrderItemDetail } from "@/types/Order";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";

export const orderProductColumns: TableColumns<
  OrderItemDetail & {
    onClickView?: () => void;
  }
> = [
  {
    title: "Name",
    key: "name",
    render: (record) => (
      <div
        className="flex items-center gap-5 cursor-pointer"
        onClick={record?.onClickView}
      >
        <div className="relative w-16 aspect-square">
          <ImageWithFallback
            src={record.thumbnailUrl}
            alt="product-thumb"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <div>{record.name}</div>
          <div className="text-gray-600 text-xs">
            Code: {record.productCode}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Price",
    key: "price",
    render: (record) => <div>{currencyFormatter(record.price.amount)}</div>,
    className: "!text-center w-[10rem]",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Total",
    key: "total",
    render: (record: OrderItemDetail) => (
      <div>{currencyFormatter(record.price.amount * record.quantity)}</div>
    ),
    className: "!text-end w-[10rem]",
  },
];
