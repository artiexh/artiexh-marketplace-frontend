import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import { CampaignData } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { dateFormatter } from "@/utils/formatter";
import { ActionIcon, Badge } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import clsx from "clsx";

export const artistCampaignColumns: TableColumns<
  CampaignData & {
    onClickEdit: () => void;
  }
> = [
  {
    title: "Tên",
    key: "name",
    dataIndex: "name",
    render: (record) => (
      <div className="flex flex-col">
        <span className="font-semibold">{record.name}</span>
        <span className="text-sm text-gray-700">Id: {record.id}</span>
      </div>
    ),
  },
  {
    title: "Loại",
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

      return <Badge className={clsx(color, "text-white")}>{record.type}</Badge>;
    },
  },
  {
    title: "Ngày mở bán",
    key: "orderTime",
    render: (record) => (
      <div className="flex flex-col">
        <span>Từ: {dateFormatter(record.from)}</span>
        <span>Đến: {dateFormatter(record.to)}</span>
      </div>
    ),
  },

  {
    title: "Trạng thái",
    key: "status",
    className: "!text-center w-[10rem]",
    render: (record) => {
      let color;
      switch (record.status) {
        case "WAITING":
          color = "bg-sky-100 text-sky-600";
          break;
        case "REQUEST_CHANGE":
          color = "bg-yellow-100 text-yellow-600";
          break;
        case "CANCELED":
          color = "bg-red-100 text-red-600";
          break;
        case "APPROVED":
          color = "bg-green-100 text-green-600";
          break;
        case "REJECTED":
          color = "bg-red-100 text-red-600";
          break;
        case "MANUFACTURING":
          color = "bg-[#e6fffb] text-[#08979c]";
          break;
        case "MANUFACTURED":
          color = "bg-gray-100 text-black";
          break;
        default:
          color = "bg-violet-100 text-violet-600";
      }

      return <Badge className={clsx(color)}>{record.status}</Badge>;
    },
  },
  {
    title: "Tác vụ",
    key: "actions",
    className: "!text-center",
    render: (record) => (
      <div className="w-[100px] flex justify-center mx-auto">
        <ActionIcon onClick={() => record.onClickEdit && record.onClickEdit()}>
          <IconEye />
        </ActionIcon>
      </div>
    ),
  },
];
