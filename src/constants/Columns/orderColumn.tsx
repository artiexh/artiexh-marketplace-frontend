import { OrderItemDetail } from "@/types/Order";
import { TableColumns } from "@/types/Table";
import { currencyFormatter } from "@/utils/formatter";

export const orderProductColumns: TableColumns<OrderItemDetail> = [
  {
    title: "Code",
    key: "productCode",
    dataIndex: "productCode",
  },
  {
    title: "Name",
    key: "name",
    render: (record: OrderItemDetail) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <img
            src={record.thumbnailUrl}
            alt="product-thumb"
            className="object-cover w-full h-full"
          />
        </div>
        <div>{record.name}</div>
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
