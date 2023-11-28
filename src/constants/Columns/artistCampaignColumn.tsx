import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { CampaignData } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { Badge } from "@mantine/core";
import clsx from "clsx";

export const artistCampaignColumns: TableColumns<
  CampaignData & {
    onClickEdit: () => void;
  }
> = [
  {
    title: "ID",
    key: "id",
    render: (
      record: CampaignData & {
        onClickEdit: () => void;
      }
    ) => (
      <div className="flex items-center gap-5">
        <div className="relative w-16 aspect-square">
          <ImageWithFallback
            fallback="/assets/default-thumbnail.jpg"
            src={record.thumbnailUrl}
            alt="product-thumb"
            className="object-contain aspect-square rounded-full"
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
    title: "Start day",
    key: "from",
    render: (record: CampaignData) => (
      <span>{new Date(record.from).toLocaleDateString()}</span>
    ),
  },
  {
    title: "End day",
    key: "to",
    render: (record: CampaignData) => (
      <span>{new Date(record.to).toLocaleDateString()}</span>
    ),
  },
  {
    title: "Type",
    key: "type",
    className: "!text-center w-[10rem]",
    render: (record: CampaignData) => {
      let color;
      switch (record.type) {
        case "SHARE":
          color = "bg-blue-500";
          break;
        case "PRIVATE":
          color = "bg-yellow-500";
          break;
        default:
          color = "bg-green-500";
      }

      return (
        <Badge
          className={clsx(
            `text-white font-semibold px-2 py-1 rounded-2xl`,
            color
          )}
        >
          {record.type}
        </Badge>
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    className: "!text-center",
    render: (record) => (
      <div>
        <span
          className="cursor-pointer border-blue-400 py-[3px] px-2 rounded-2xl text-xs bg-blue-400 text-white font-semibold"
          onClick={record.onClickEdit}
        >
          View
        </span>
      </div>
    ),
  },
];
