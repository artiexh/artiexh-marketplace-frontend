import { CampaignData } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { currencyFormatter, dateFormatter } from "@/utils/formatter";
import { Badge } from "@mantine/core";
import clsx from "clsx";

export const saleCampaignColumns: TableColumns<
  CampaignData & {
    onView: () => void;
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
    title: "Public date",
    key: "publicDate",
    dataIndex: "publicDate",
    render: (record) => <span>{dateFormatter(record.publicDate)}</span>,
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
        case "ACTIVE":
          color = "bg-blue-500";
          break;
        case "DRAFT":
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
          onClick={() => record?.onView()}
        >
          View
        </span>
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
    dataIndex: "name",
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
