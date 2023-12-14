"use client";

import TableComponent from "@/components/TableComponent";
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
import { CampaignData } from "@/types/Campaign";
import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import { ValidationError } from "@/utils/error/ValidationError";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
import { campaignValidation } from "@/validation/campaign";
import {
  Button,
  Input,
  Pagination,
  SegmentedControl,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const PAGE_SIZE = 8;
const ShopCampaignsPage = () => {
  const router = useRouter();

  const [params, setParams] = useState<{ [key: string]: any }>({
    pageSize: PAGE_SIZE,
    pageNumber: 1,
    status: null,
    keyword: null,
  });

  const { data: response, isLoading } = useSWR(
    ["campaign-request", ...Object.values(params)],
    () =>
      axiosClient.get<CommonResponseBase<PaginationResponseBase<CampaignData>>>(
        `${ARTIST_CAMPAIGN_ENDPOINT}`,
        {
          params: params,
        }
      )
  );

  const data = response?.data.data;

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
          Tạo campaign request
        </Button>
      </div>
      <div className="product-table-page">
        <div className="py-5 px-7 bg-white shadow rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-3xl font-bold">Campaign requests</div>
              <div className="text-[#AFAFAF] mt-1 mb-4">
                {/* TODO: Replace with API call later or filter based on response */}
                {data?.totalSize} campaign requests
              </div>
            </div>
            <div>
              <Input.Wrapper label="Trạng thái">
                <Select
                  value={params.status}
                  onChange={(value) => {
                    setParams({
                      ...params,
                      status: value,
                      pageNumber: 1,
                    });
                  }}
                  data={[
                    {
                      //@ts-ignore
                      value: null,
                      label: "All",
                    },
                    {
                      value: "DRAFT",
                      label: "Draft",
                    },
                    {
                      value: "WAITING",
                      label: "Waiting",
                    },
                    {
                      value: "REQUEST_CHANGE",
                      label: "Request change",
                    },
                    {
                      value: "REJECTED",
                      label: "Rejected",
                    },
                    {
                      value: "APPROVED",
                      label: "Approved",
                    },
                    {
                      value: "MANUFACTURING",
                      label: "Manufacturing",
                    },
                    {
                      value: "MANUFACTURED",
                      label: "Manufactured",
                    },
                    {
                      value: "CANCELED",
                      label: "Canceled",
                    },
                  ]}
                />
              </Input.Wrapper>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            {!isLoading && (
              <TableComponent
                columns={artistCampaignColumns}
                data={data?.items.map((el) => ({
                  ...el,
                  onClickEdit: () =>
                    router.push(`${ROUTE.SHOP}/campaigns/${el.id}`),
                  onClickDelete: async () => {
                    try {
                      await updateCampaignStatusApi(el.id, {
                        message: "Cancel campaign",
                        status: "CANCELED",
                      });
                    } catch (e) {
                      errorHandler(e);
                    }
                  },
                }))}
              />
            )}
            <Pagination
              value={params.pageNumber}
              onChange={(value) => setParams({ ...params, pageNumber: value })}
              total={data?.totalPage ?? 1}
              boundaries={2}
              classNames={{
                control: "[&[data-active]]:!text-white",
              }}
            />
          </div>
        </div>
      </div>
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

  const createCampaignRequestMutation = useMutation({
    mutationFn: async (values: {
      name?: string;
      type: "PRIVATE" | "SHARE";
    }) => {
      if (!values.name)
        throw new ValidationError("Thông tin về tên không phù hợp!");

      const res = await createCampaignApi({
        name: values.name,
        type: values.type,
      });

      return res.data;
    },
    onSuccess: (data) => {
      notifications.show({
        message: "Tạo campaign thành công!",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      router.push(`/my-shop/campaigns/${data.data.id}`);
      modals.close("create-campaign-info");
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        createCampaignRequestMutation.mutate(values)
      )}
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
        <Button
          loading={createCampaignRequestMutation.isLoading}
          className="bg-primary !text-white"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default ShopCampaignsPage;
