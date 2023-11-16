"use client";

import axiosClient from "@/services/backend/axiosClient";
import { SALE_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { SaleCampaignDetail } from "@/types/SaleCampaign";
import { Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import SaleCampaignGeneralInfoForm from "./SaleCampaignGeneralInfoForm";
import CustomWebTab from "./CustomWebTab";

export default function SaleCampaignDetailContainer() {
  const router = useRouter();
  const params = useParams();

  const id = params!.id as string;
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [SALE_CAMPAIGN_ENDPOINT, { id: id }],
    queryFn: async () => {
      const res = await axiosClient.get<CommonResponseBase<SaleCampaignDetail>>(
        `/artist${SALE_CAMPAIGN_ENDPOINT}/${id}`
      );

      return res.data;
    },
  });

  if (isLoading || !res?.data) return null;

  return (
    <>
      <div className="mt-10 bg-white rounded-md  px-4 py-2.5 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2.5 items-center">
            {/* <Badge>{res.data.status}</Badge> */}
            <h1 className="text-2xl">{res.data.name}</h1>
          </div>

          <div className="h-fit flex gap-x-3"></div>
        </div>
      </div>
      <Tabs defaultValue="general-info" className="mt-5">
        <Tabs.List>
          <Tabs.Tab value="general-info">Info</Tabs.Tab>
          <Tabs.Tab value="promote-details">Web</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general-info">
          <SaleCampaignGeneralInfoForm
            disabled={disabled}
            data={{
              from: res.data.from,
              to: res.data.to,
              name: res.data.name,
              description: res.data.description,
              publicDate: res.data.publicDate,
              type: res.data.type,
            }}
          />
          <div className="mt-4">
            {/* <CustomProductTable
              data={res.data.products}
              setDisabled={setDisabled}
            /> */}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="promote-details">
          <CustomWebTab data={res.data} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
