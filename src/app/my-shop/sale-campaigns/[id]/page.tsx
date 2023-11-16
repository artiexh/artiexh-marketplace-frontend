"use client";

import SaleCampaignDetailContainer from "@/containers/SaleCampaignDetailContainer/SaleCampaignDetailContainer";
import SaleCampaignStatisticContainer from "@/containers/SaleCampaignStatistic/SaleCampaignStatistic";
import axiosClient from "@/services/backend/axiosClient";
import { SALE_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { CampaignDetail } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function SaleCampaignDetailPage() {
  const params = useParams();
  const id = (params?.id ?? "") as string;

  const [isDetailPage, setIsDetailPage] = useState<boolean>(true);
  const {
    data: res,
    isLoading,
    mutate,
  } = useSWR([SALE_CAMPAIGN_ENDPOINT, id], async () => {
    const res = await axiosClient.get<CommonResponseBase<CampaignDetail>>(
      `/artist${SALE_CAMPAIGN_ENDPOINT}/${id}`
    );

    return res.data;
  });

  if (isLoading || !id || !res?.data) return null;

  return (
    <>
      <div className="flex gap-4 mb-10">
        <div
          className={clsx(
            isDetailPage
              ? "font-bold bg-black text-white"
              : "border border-black",
            "cursor-pointer px-4 py-1 rounded-2xl"
          )}
          onClick={() => setIsDetailPage(true)}
        >
          General information
        </div>
        <div
          className={clsx(
            !isDetailPage
              ? "font-bold bg-black text-white"
              : "border border-black",
            "cursor-pointer px-4 py-1 rounded-2xl"
          )}
          onClick={() => setIsDetailPage(false)}
        >
          History
        </div>
      </div>
      <div className="mt-10 bg-white rounded-md p-8 flex flex-col shadow">
        <div className={isDetailPage ? "" : "hidden"}>
          <SaleCampaignDetailContainer />
        </div>
        <div className={!isDetailPage ? "" : "hidden"}>
          <SaleCampaignStatisticContainer id={id} />
        </div>
      </div>
    </>
  );
}
