import TableComponent from "@/components/TableComponent";
import axiosClient from "@/services/backend/axiosClient";
import { ARTIST_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { CampaignDetail } from "@/types/Campaign";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { TableColumns } from "@/types/Table";
import { Pagination } from "@mantine/core";

import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

export default function CampaignHistoryTab({
  campaignId,
}: {
  campaignId: string;
}) {
  const [params, setParams] = useState({
    pageSize: 10,
    pageNumber: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      ARTIST_CAMPAIGN_ENDPOINT,
      "campaign-history",
      { id: campaignId, ...params },
    ],
    queryFn: async () => {
      const res = await axiosClient.get<
        CommonResponseBase<
          PaginationResponseBase<CampaignDetail["campaignHistories"][0]>
        >
      >(`${ARTIST_CAMPAIGN_ENDPOINT}/${campaignId}/campaign-history`, {
        params: params,
      });
      return res.data;
    },
  });

  return (
    <div className="py-5 px-7 bg-white rounded-lg">
      <>
        <div className="text-3xl font-bold">Histories</div>
        <div className="text-[#AFAFAF] mt-1 mb-4">
          {data?.data.totalSize} histories
        </div>
      </>
      <div className="flex flex-col items-center gap-4 w-full">
        <TableComponent
          columns={campaignHistoryColumns}
          data={data?.data.items ?? []}
        />
        <Pagination
          value={params.pageNumber}
          onChange={(value) =>
            setParams((prev) => ({ ...prev, pageNumber: value }))
          }
          total={data?.data.totalPage ?? 1}
          boundaries={2}
          classNames={{
            control: "[&[data-active]]:!text-white",
          }}
        />
      </div>
    </div>
  );
}

export const campaignHistoryColumns: TableColumns<
  CampaignDetail["campaignHistories"][0]
> = [
  {
    title: "Date",
    key: "date",
    render: (record: CampaignDetail["campaignHistories"][0]) => (
      <span>
        {record.eventTime &&
          Intl.DateTimeFormat(undefined, {
            timeStyle: "medium",
            dateStyle: "medium",
          }).format(new Date(record.eventTime))}
      </span>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Created by",
    dataIndex: "updatedBy",
    key: "updatedBy",
  },
];
