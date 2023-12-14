"use client";

import { NOTIFICATION_TYPE } from "@/constants/common";
import CampaignGeneralInfoForm from "@/containers/CampaignContainers/CampaignGeneralInfoForm";
import CampaignHistoryTab from "@/containers/CampaignContainers/CampaignHistoryTab";
import CustomProductTable from "@/containers/CampaignContainers/CustomProductTable/CustomProductTable";
import CustomWebTab from "@/containers/CampaignContainers/CustomWebTab";
import axiosClient from "@/services/backend/axiosClient";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  updateCampaignStatusApi,
} from "@/services/backend/services/campaign";
import { CampaignDetail } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { isDisabled } from "@/utils/campaign.utils";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
import { Badge, Button, Tabs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = params!.id as string;

  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [ARTIST_CAMPAIGN_ENDPOINT, { id: id }],
    queryFn: async () => {
      const res = await axiosClient.get<CommonResponseBase<CampaignDetail>>(
        `${ARTIST_CAMPAIGN_ENDPOINT}/${id}`
      );

      return res.data;
    },
  });

  const submitCampaignMutation = useMutation({
    mutationFn: async () => {
      const res = await updateCampaignStatusApi(id, {
        message: "Submit to admin",
        status: "WAITING",
      });

      return res;
    },
    onSuccess: () => {
      notifications.show({
        message: "Gửi yêu cầu thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: (e) => {
      errorHandler(e);
    },
    onSettled: () => {
      refetch();
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async () => {
      const res = await updateCampaignStatusApi(id, {
        message: "Cancel campaign",
        status: "CANCELED",
      });

      return res;
    },
    onSuccess: () => {
      notifications.show({
        message: "Xóa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: (e) => {
      errorHandler(e);
    },
    onSettled: () => {
      refetch();
    },
  });

  if (isLoading || !res?.data) return null;

  const customProducts = res!.data.products;

  return (
    <>
      <div className="mt-10 bg-white rounded-md  px-4 py-2.5 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2.5 items-center">
            <Badge>{res.data.status}</Badge>
            <h1 className="text-2xl">{res.data.name}</h1>
          </div>

          <div className="h-fit flex gap-x-3">
            <Button
              disabled={
                ["APPROVED", "REJECTED", "CANCELED"].includes(
                  res.data.status
                ) || submitCampaignMutation.isLoading
              }
              onClick={() => deleteCampaignMutation.mutate()}
              className="mb-0 !text-red-600 border-red-600 hover:bg-red-600 hover:!text-white"
            >
              Huỷ chiến dịch
            </Button>
            <Button
              disabled={isDisabled(res.data.status)}
              loading={submitCampaignMutation.isLoading}
              onClick={() => submitCampaignMutation.mutate()}
              className="mb-0 !text-primary border-primary hover:bg-primary hover:!text-white"
            >
              Nộp chiến dịch
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="general-info" className="mt-5" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="general-info">Thông tin</Tabs.Tab>
          <Tabs.Tab value="promote-details">Web</Tabs.Tab>
          <Tabs.Tab value="history">Lịch sử</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general-info">
          <CampaignGeneralInfoForm
            disabled={!["DRAFT", "REQUEST_CHANGE"].includes(res.data.status)}
            data={{
              status: res.data.status,
              from: res.data.from,
              to: res.data.to,
              name: res.data.name,
              description: res.data.description,
              campaignHistories: res.data.campaignHistories ?? [],
              type: res.data.type,
            }}
          />
          <div className="mt-4">
            <CustomProductTable
              disabled={isDisabled(res.data.status)}
              data={res.data.products}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="promote-details">
          <CustomWebTab data={res.data} />
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <CampaignHistoryTab campaignId={res.data.id as string} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
