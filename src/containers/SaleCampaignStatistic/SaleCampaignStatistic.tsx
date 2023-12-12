import TableComponent from "@/components/TableComponent";
import { statisticCampaignColumns } from "@/constants/Columns/saleCampaignColumn";
import axiosClient from "@/services/backend/axiosClient";
import { SALE_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { SaleCampaignStatistic } from "@/types/Campaign";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { getDateRange } from "@/utils/date";
import { currencyFormatter } from "@/utils/formatter";
import {
  Progress,
  Tooltip as MantineTooltip,
  Paper,
  Group,
  Text,
  Tabs,
  Table,
  Pagination,
} from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import clsx from "clsx";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import useSWR from "swr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function SaleCampaignStatisticContainer({ id }: { id: string }) {
  const { data: statisticData, isLoading } = useSWR(
    [SALE_CAMPAIGN_ENDPOINT, id, "statistic"],
    async () => {
      const res = await axiosClient.get<
        CommonResponseBase<SaleCampaignStatistic>
      >(`${SALE_CAMPAIGN_ENDPOINT}/${id}/statistics`);

      return res.data.data;
    }
  );

  if (!statisticData) return <></>;

  const doughnutChartData = {
    labels: ["Lợi nhuận", "Tiền sản xuất"],
    datasets: [
      {
        label: "Tổng cộng",
        data: [
          statisticData.profit.amount,
          statisticData.revenue.amount - statisticData.profit.amount,
        ],

        backgroundColor: ["#7D3EC9", "#CAABF1"],
        borderColor: ["#7D3EC9", "#CAABF1"],
        borderWidth: 1,
      },
    ],
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any }) {
      const { ctx } = chart;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `Tổng: ${currencyFormatter(statisticData.revenue.amount)}`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };

  const statisticCardData = [
    {
      title: "Ngày bắt đầu",
      stylingClass: "bg-yellow-400",
      content: new Date(statisticData.from).toLocaleDateString(),
      desc: "Ngày bắt đầu chiến dịch",
    },
    {
      title: "Ngày kết thúc",
      stylingClass: "bg-red-600",
      content: new Date(statisticData.to).toLocaleDateString(),
      desc: "Ngày kết thúc chiến dịch",
    },
    {
      title: "Tổng doanh thu",
      stylingClass: "bg-blue-600",
      content: currencyFormatter(statisticData.revenue.amount),
      desc: "Tổng tiền bán được",
    },
    {
      title: "Tổng lợi nhuận",
      stylingClass: "bg-green-600",
      content: currencyFormatter(statisticData.profit.amount),
      desc: "Tổng lợi nhuận mà bạn sẽ nhận được",
    },
  ];

  const getMessage = () => {
    if (new Date(statisticData.to).getTime() < new Date().getTime()) {
      return "Chiến dịch đã kết thúc";
    }

    const gap = getDateRange(new Date(statisticData.from), new Date());

    if (gap.value > 0) {
      return `Chiến dịch đang diễn ra`;
    } else {
      return `Chiến dịch sẽ diễn ra sau ${Math.abs(Math.floor(gap.value))} ${
        gap.type === "date" ? "ngày" : "giờ"
      }`;
    }
  };

  return (
    <div>
      <div className="mb-6 font-semibold text-xl">Tổng quan:</div>
      <div className="flex items-center gap-20">
        <Doughnut
          data={doughnutChartData}
          className="!w-[400px] !h-[400px]"
          plugins={[textCenter]}
        />
        <div className="flex-1">
          <div
            className={clsx(
              "py-4 px-6 rounded shadow bg-[rgba(235,222,247,1)] mb-4"
            )}
          >
            <div className="text-xl font-semibold flex items-center justify-center gap-2 ">
              <IconClock />
              <div>{getMessage()}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statisticCardData.map((item) => (
              <Paper withBorder p="md" radius="md" key={item.title}>
                <Group>
                  <div>
                    <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                      {item.title}
                    </Text>
                    <Text fw={700} fz="xl">
                      {item.content}
                    </Text>
                  </div>
                </Group>
                <Text c="dimmed" fz="sm" mt="md">
                  {item.desc}
                </Text>
              </Paper>
              // <div
              //   className={clsx("py-6 px-6 rounded shadow border bg-[#D8EBFF]")}
              //   key={item.title}
              // >
              //   <div className="text-xl font-semibold mb-4">{item.title}</div>
              //   <div>{item.content}</div>
              // </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 mb-6 font-semibold text-xl">Thống kê số lượng:</div>
      <div className="flex gap-10">
        <div className="bg-[#F8F9FB] p-4 rounded-sm shadow flex-1">
          <TableComponent
            columns={statisticCampaignColumns}
            data={statisticData.products}
          />
        </div>
        <div className="w-[300px] bg-[#F8F9FB] rounded-sm shadow  p-4">
          <div className="text-lg font-semibold mb-4">Xếp hạng sản phẩm:</div>
          <div className="flex flex-col gap-4">
            {statisticData.products
              .sort((a, b) => b.soldQuantity - a.soldQuantity)
              .map((item) => (
                <div key={item.productCode}>
                  <div className="font-semibold">{item.name}</div>
                  <div>
                    <MantineTooltip
                      label={`Số lượng bán được: ${item.soldQuantity}`}
                    >
                      <Progress
                        value={Math.round(
                          (item.soldQuantity /
                            statisticData.products.reduce(
                              (acc, p) => acc + p.soldQuantity,
                              0
                            )) *
                            100
                        )}
                      />
                    </MantineTooltip>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SaleCampaignStatistics({ id }: { id: string }) {
  return (
    <Tabs defaultValue="general-info" className="mt-5">
      <Tabs.List>
        <Tabs.Tab value="general-info">Statistics</Tabs.Tab>

        <Tabs.Tab value="products">Products</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general-info">
        <SaleCampaignStatisticContainer id={id} />
      </Tabs.Panel>
      <Tabs.Panel value="products">
        <ProductStatisticTable id={id} />
      </Tabs.Panel>
    </Tabs>
  );
}

function ProductStatisticTable({ id }: { id: string }) {
  const [params, setParams] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: [SALE_CAMPAIGN_ENDPOINT, id, "products", params],
    queryFn: async () => {
      const p = new URLSearchParams();
      p.append("pageNumber", params.pageNumber.toString());
      p.append("pageSize", params.pageSize.toString());
      const res = await axiosClient.get<
        CommonResponseBase<
          PaginationResponseBase<SaleCampaignStatistic["products"][0]>
        >
      >(`${SALE_CAMPAIGN_ENDPOINT}/${id}/sold-product?` + p.toString());

      return res.data;
    },
  });

  return (
    <>
      <TableComponent
        columns={statisticCampaignColumns}
        data={data?.data.items ?? []}
      />
      <Pagination
        value={params.pageNumber}
        onChange={(value) => setParams({ ...params, pageNumber: value })}
        //TODO: change this to total of api call later
        total={data?.data.totalPage ?? 1}
        boundaries={2}
        classNames={{
          control: "[&[data-active]]:!text-white",
        }}
      />
    </>
  );
}
