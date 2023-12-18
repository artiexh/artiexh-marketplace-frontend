import { CampaignData } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { currencyFormatter, dateFormatter } from "@/utils/formatter";
import { ActionIcon, Badge } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import clsx from "clsx";

export const saleCampaignColumns: TableColumns<
  CampaignData & {
    onView: () => void;
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

      return <Badge className={clsx(`text-white`, color)}>{record.type}</Badge>;
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
    title: "Ngày hiển thị",
    key: "publicDate",
    dataIndex: "publicDate",
    render: (record) => <span>{dateFormatter(record.publicDate)}</span>,
  },

  {
    title: "Trạng thái",
    key: "status",
    className: "!text-center w-[10rem]",
    render: (record) => {
      let color;
      switch (record.status) {
        case "ACTIVE":
          color = "bg-sky-100 text-sky-600";
          break;
        case "DRAFT":
          color = "bg-[#e6fffb] text-[#08979c]";
          break;
        default:
          color = "bg-gray-100 text-black";
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
        <ActionIcon onClick={() => record.onView && record.onView()}>
          <IconEye />
        </ActionIcon>
      </div>
    ),
  },
];

export const statisticCampaignColumns: TableColumns<{
  productCode: string;
  soldQuantity: number;
  quantity: number;
  name: string;
  revenue: {
    amount: number;
    unit: string;
  };
}> = [
  {
    title: "Mã sản phẩm",
    key: "productCode",
    dataIndex: "productCode",
  },
  {
    title: "Tên sản phẩm",
    key: "name",
    className: "!text-center w-[10rem]",
    render: (value) => <div>{value.name}</div>,
  },
  {
    title: "Tổng số lượng",
    key: "quantity",
    className: "!text-center w-[10rem]",
    dataIndex: "quantity",
  },
  {
    title: "Đã bán được",
    key: "soldQuantity",
    className: "!text-center w-[10rem]",
    dataIndex: "soldQuantity",
  },
  {
    title: "Doanh thu",
    key: "revenue",
    className: "!text-center w-[10rem]",
    render: (value) => <div>{currencyFormatter(value.revenue.amount)}</div>,
  },
];
