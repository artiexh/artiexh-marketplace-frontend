import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { ArtistCampaignColumnType } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { priceToString } from "@/utils/price";
import { Badge } from "@mantine/core";
import { IconBallpen } from "@tabler/icons-react";
import Image from "next/image";

const shopCampaignColumns: TableColumns<ArtistCampaignColumnType> = [
  {
    title: "ID",
    key: "id",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            src={record.thumb}
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
    dataIndex: "name",
  },
  {
    title: "Total",
    key: "total",
    render: (record) => <div>{priceToString(record.total)}</div>,
  },
  {
    title: "Payment",
    key: "payment",
    dataIndex: "payment",
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
    render: (_, actionHandler) => (
      <div className="flex justify-center">
        <IconBallpen
          className="cursor-pointer"
          onClick={() => actionHandler && actionHandler()}
        />
      </div>
    ),
  },
];

export default shopCampaignColumns;
