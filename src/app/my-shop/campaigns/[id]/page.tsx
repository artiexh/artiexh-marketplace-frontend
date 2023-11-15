"use client";

import { NOTIFICATION_TYPE } from "@/constants/common";
import CampaignGeneralInfoForm from "@/containers/CampaignContainers/CampaignGeneralInfoForm";
import CustomProductTable from "@/containers/CampaignContainers/CustomProductTable/CustomProductTable";
import CustomWebTab from "@/containers/CampaignContainers/CustomWebTab";
import axiosClient from "@/services/backend/axiosClient";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  updateCampaignStatusApi,
} from "@/services/backend/services/campaign";
import { CampaignDetail } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { getNotificationIcon } from "@/utils/mapper";
import { Badge, Button, Tabs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

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

  const submitCampaignHandler = async () => {
    const res = await updateCampaignStatusApi(id, {
      message: "Submit to admin",
      status: "WAITING",
    });

    if (res != null) {
      notifications.show({
        message: "Gửi yêu cầu thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    } else {
      notifications.show({
        message: "Gửi yêu cầu thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }

    refetch();
  };

  const deleteCampaignHandler = async () => {
    const res = await updateCampaignStatusApi(id, {
      message: "Cancel campaign",
      status: "CANCELED",
    });

    if (res != null) {
      notifications.show({
        message: "Xóa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    } else {
      notifications.show({
        message: "Xóa thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }

    refetch();
  };

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
              disabled={["APPROVED", "REJECTED", "CANCELED"].includes(
                res.data.status
              )}
              onClick={deleteCampaignHandler}
              className="mb-0"
            >
              Delete
            </Button>
            <Button
              disabled={!["DRAFT", "REQUEST_CHANGE"].includes(res.data.status)}
              onClick={submitCampaignHandler}
              className="mb-0"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="general-info" className="mt-5">
        <Tabs.List>
          <Tabs.Tab value="general-info">Info</Tabs.Tab>
          <Tabs.Tab value="promote-details">Web</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
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
            <CustomProductTable data={res.data.products} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="promote-details">
          <CustomWebTab data={res.data} />
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <h1>History</h1>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
