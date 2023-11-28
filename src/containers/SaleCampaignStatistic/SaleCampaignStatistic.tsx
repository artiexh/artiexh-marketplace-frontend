import TableComponent from "@/components/TableComponent";
import { statisticCampaignColumns } from "@/constants/Columns/saleCampaignColumn";
import axiosClient from "@/services/backend/axiosClient";
import { SALE_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { SaleCampaignStatistic } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { getDateRange } from "@/utils/date";
import { currencyFormatter } from "@/utils/formatter";
import { Progress, Tooltip as MantineTooltip } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
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

export default function SaleCampaignStatisticContainer({ id }: { id: string }) {
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
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
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
        `Tổng doanh thu: ${currencyFormatter(statisticData.revenue.amount)}`,
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
    },
    {
      title: "Ngày kết thúc",
      stylingClass: "bg-red-600",
      content: new Date(statisticData.to).toLocaleDateString(),
    },
    {
      title: "Tổng doanh thu",
      stylingClass: "bg-blue-600",
      content: currencyFormatter(statisticData.revenue.amount),
    },
    {
      title: "Tổng lợi nhuận",
      stylingClass: "bg-green-600",
      content: currencyFormatter(statisticData.profit.amount),
    },
  ];

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
          <div className={clsx("py-4 px-6 rounded shadow bg-[#FFDDE3] mb-4")}>
            <div className="text-xl font-semibold flex items-center justify-center gap-2    ">
              <IconClock />
              <div>
                {getDateRange(new Date(statisticData.from), new Date()) > 0
                  ? `Đã diễn ra được:
                ${getDateRange(new Date(statisticData.from), new Date())} ngày`
                  : `Chiến dịch sẽ diễn ra sau ${Math.abs(
                      getDateRange(new Date(statisticData.from), new Date())
                    )} ngày nữa`}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statisticCardData.map((item) => (
              <div
                className={clsx("py-6 px-6 rounded shadow border bg-[#D8EBFF]")}
                key={item.title}
              >
                <div className="text-xl font-semibold mb-4">{item.title}</div>
                <div>{item.content}</div>
              </div>
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
