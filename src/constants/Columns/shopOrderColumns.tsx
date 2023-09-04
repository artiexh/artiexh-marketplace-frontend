import { ArtistOrderColumnType } from "@/types/Order";
import { TableColumns } from "@/types/Table";
import { priceToString } from "@/utils/price";
import { Badge } from "@mantine/core";
import { IconBallpen } from "@tabler/icons-react";
import Image from "next/image";
import { ROUTE } from "../route";

const shopOrderColumns: () => TableColumns<ArtistOrderColumnType> = () => {
  return [
    {
      title: "ID",
      key: "id",
      render: (record) => (
        <div className="flex items-center gap-5">
          <div className="relative w-16 aspect-square">
            <Image
              src={record.orderDetails[0].thumbnailUrl ?? ""}
              alt="product-thumb"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <div>{record.id}</div>
        </div>
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (record) => <div>{record.orderDetails[0].name}</div>,
    },
    {
      title: "Quantity",
      key: "Quantity",
      render: (record) => <div>{record.orderDetails[0].quantity}</div>,
    },
    {
      title: "Payment",
      key: "payment",
      render: (record) => <div>{record.paymentMethod}</div>,
    },
    {
      title: "Status",
      key: "status",
      className: "!text-center w-[10rem]",
      render: (record) => (
        <Badge
          variant="gradient"
          gradient={{ from: "orange", to: "red" }}
          classNames={{ inner: "!leading-tight" }}
        >
          {record.status}
        </Badge>
      ),
    },
    {
      title: "Action",
      key: "action",
      action: "EDIT",
      className: "!text-center",
      render: (record, actionHandler) => (
        <div className="flex justify-center">
          <IconBallpen
            className="cursor-pointer"
            onClick={() =>
              window.location.replace(`${ROUTE.SHOP}/orders/${record.id}/edit`)
            }
          />
        </div>
      ),
    },
  ];
};

export default shopOrderColumns;
