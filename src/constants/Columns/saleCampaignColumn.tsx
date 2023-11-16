import { CampaignData } from "@/types/Campaign";
import { TableColumns } from "@/types/Table";
import { Badge } from "@mantine/core";
import clsx from "clsx";

export const saleCampaignColumns: TableColumns<
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
    render: (value) => <div>{value.revenue.amount}</div>,
  },
];
