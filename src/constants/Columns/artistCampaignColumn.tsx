import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { CampaignData } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { dateFormatter } from "@/utils/formatter";
import { Badge } from "@mantine/core";
import clsx from "clsx";

export const artistCampaignColumns: TableColumns<
  CampaignData & {
    onClickEdit: () => void;
  }
> = [
  {
    title: "Id",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
    render: (record) => (
      <div className="flex flex-col">
        <span>{record.name}</span>
        <span className="text-sm text-gray-500">
          Owner: {record.owner.username}
        </span>
      </div>
    ),
  },
  {
    title: "Order time",
    key: "orderTime",
    render: (record) => (
      <div className="flex flex-col">
        <span>From: {dateFormatter(record.from)}</span>
        <span>To: {dateFormatter(record.to)}</span>
      </div>
    ),
  },

  {
    title: "Type",
    key: "type",
    className: "!text-center w-[10rem]",
    render: (record) => {
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
    title: "Status",
    key: "status",
    className: "!text-center w-[10rem]",
    render: (record) => {
      let color;
      switch (record.status) {
        case "WAITING":
          color = "bg-[#DBD33E]";
          break;
        case "REQUEST_CHANGE":
          color = "bg-[#FB931D] text-white";
          break;
        case "CANCELED":
          color = "bg-[#9093A4] text-white";
          break;
        case "APPROVED":
          color = "bg-[#1AC455] text-white";
          break;
        case "REJECTED":
          color = "bg-[##F21616] text-white";
          break;
        case "MANUFACTURING":
          color = "bg-[#9E3FC9] text-white";
          break;
        case "MANUFACTURED":
          color = "bg-[#5C68AC] text-white";
          break;
        default:
          color = "bg-[#09B8FF]";
      }

      return (
        <Badge
          className={clsx(
            `text-white font-semibold px-2 py-1 rounded-2xl`,
            color
          )}
        >
          {record.status}
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
          onClick={() => record?.onClickEdit()}
        >
          View
        </span>
      </div>
    ),
  },
];
