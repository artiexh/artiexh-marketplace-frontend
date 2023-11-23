"use client";

import { artistCampaignColumns } from "@/constants/Columns/artistCampaignColumn";
import { NOTIFICATION_TYPE } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import TableContainer from "@/containers/TableContainer";
import axiosClient from "@/services/backend/axiosClient";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  createCampaignApi,
  updateCampaignStatusApi,
} from "@/services/backend/services/campaign";
import { getNotificationIcon } from "@/utils/mapper";
import { campaignValidation } from "@/validation/campaign";
import { Button, SegmentedControl, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 6;
const ShopCampaignsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCreateCampaign = () => {
    modals.open({
      modalId: "create-campaign-info",
      title: "Input campaign information",
      classNames: {
        content: "!w-[30rem] !h-fit top-1/3 left-[30%]",
      },
      centered: true,
      children: <CreateCampaignModal />,
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          leftIcon={<IconPlus />}
          type="button"
          onClick={handleCreateCampaign}
          variant="outline"
        >
          Create campaign request
        </Button>
      </div>
      <TableContainer
        fetchKey="campaigns"
        fetcher={async (currentPage) => {
          const res = (
            await axiosClient.get(
              `${ARTIST_CAMPAIGN_ENDPOINT}?pageNumber=${currentPage}&pageSize=${PAGE_SIZE}` +
                new URLSearchParams(searchParams?.toString()).toString()
            )
          ).data;
          const finalRes = {
            ...res,
            data: {
              ...res.data,
              items: res.data.items?.map((el: any) => ({
                ...el,
                onClickEdit: () =>
                  router.push(`${ROUTE.SHOP}/campaigns/${el.id}`),
                onClickDelete: async () => {
                  await updateCampaignStatusApi(el.id, {
                    message: "Cancel campaign",
                    status: "CANCELED",
                  });
                },
              })),
            },
          };
          return finalRes;
        }}
        columns={artistCampaignColumns}
        pagination
        tableProps={{ verticalSpacing: "sm", className: "font-semibold" }}
        className="mt-2.5"
        header={(response) => (
          <>
            <div className="text-3xl font-bold">My campaign requests</div>
            <div className="text-[#AFAFAF] mt-1">
              {/* TODO: Replace with API call later or filter based on response */}
              {response?.items?.length} products need to be updated their status
            </div>
          </>
        )}
      />
    </>
  );
};

function CreateCampaignModal() {
  const router = useRouter();

  const form = useForm<{
    name?: string;
    type: "PRIVATE" | "SHARE";
  }>({
    initialValues: {
      type: "PRIVATE",
    },
    validate: campaignValidation,
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });
  const submitHandler = async () => {
    try {
      if (!form.values.name) return;

      const res = await createCampaignApi({
        name: form.values.name,
        type: form.values.type,
      });

      notifications.show({
        message: "Tạo campaign thành công!",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      router.push(`/my-shop/campaigns/${res.data.data.id}`);

      modals.close("create-campaign-info");
    } catch (err) {
      notifications.show({
        message: "Tạo campaign thất bại! Vui lòng thử lại",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    }
  };
  return (
    <form
      onSubmit={form.onSubmit(submitHandler)}
      className="flex flex-col gap-4"
    >
      <SegmentedControl
        {...form.getInputProps("type")}
        data={[
          { label: "Private campaign", value: "PRIVATE" },
          { label: "Shared campaign", value: "SHARE" },
        ]}
      />
      <TextInput label="Campaign name" {...form.getInputProps("name")} />

      <div className="flex justify-end ">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

export default ShopCampaignsPage;
