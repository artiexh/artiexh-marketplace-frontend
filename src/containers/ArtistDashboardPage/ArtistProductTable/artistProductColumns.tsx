import { ArtistProductColumnType } from "@/types/Product";
import { TableColumns } from "@/types/Table";
import { Badge } from "@mantine/core";
import { IconBallpen } from "@tabler/icons-react";
import Image from "next/image";

const artistProductColumns: TableColumns<ArtistProductColumnType> = [
  {
    title: "Name",
    key: "name",
    render: (record) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <Image
            src={record.thumbnailUrl}
            alt="product-thumb"
            fill
            className="object-contain rounded-lg"
          />
        </div>
        <div>{record.name}</div>
      </div>
    ),
  },
  {
    title: "Release Date",
    dataIndex: "publishDatetime",
    key: "publishDatetime",
  },
  {
    title: "Quantity",
    dataIndex: "maxItemsPerOrder",
    key: "maxItemsPerOrder",
    className: "!text-center w-[10rem]",
  },
  {
    title: "Status",
    key: "status",
    className: "!text-center w-[10rem]",
    render: (record) => (
      <Badge
        variant="gradient"
        gradient={{ from: "teal", to: "lime", deg: 105 }}
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

export default artistProductColumns;
