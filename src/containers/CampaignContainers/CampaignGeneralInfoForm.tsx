import {
  NOTIFICATION_TYPE,
  defaultButtonStylingClass,
} from "@/constants/common";
import {
  ARTIST_CAMPAIGN_ENDPOINT,
  updateCampaignGeneralInfoApi,
} from "@/services/backend/services/campaign";
import { CampaignDetail, CampaignHistory } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { getNotificationIcon } from "@/utils/mapper";
import { campaignInfoValidation } from "@/validation/campaign";
import {
  Button,
  SegmentedControl,
  Text,
  TextInput,
  Textarea,
  Timeline,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function CampaignGeneralInfoForm({
  data,
  disabled = false,
}: {
  data: Pick<
    CampaignDetail,
    | "name"
    | "description"
    | "campaignHistories"
    | "type"
    | "from"
    | "to"
    | "status"
  >;
  disabled?: boolean;
}) {
  const params = useParams();

  const id = params!.id as string;

  const editHandler = () => {
    modals.open({
      modalId: "edit-campaign-info-" + id,
      title: "Edit general info",
      size: "xl",
      centered: true,
      classNames: {
        content: "!overflow-y-visible !rounded-md",
        header: "!rounded-t-md",
      },
      children: (
        <EditCampaignGeneralInfo data={data} campaignId={id as string} />
      ),
    });
  };

  const finalHistory: CampaignHistory[] =
    data.campaignHistories.length < 3
      ? [
          ...data.campaignHistories,
          {
            action: "START",
            message: "Start create campaign",
            updatedBy: "System",
          },
        ]
      : data.campaignHistories.slice(-3);

  return (
    <div className="card general-wrapper mt-2 ">
      <div className="flex gap-x-4">
        <div className="flex flex-col space-y-4 flex-[3]">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-3xl font-bold">Campaign information</h2>
            <Button
              disabled={
                data.status !== "DRAFT" && data.status !== "REQUEST_CHANGE"
              }
              onClick={editHandler}
              className={defaultButtonStylingClass}
            >
              Edit
            </Button>
          </div>
          <div className="flex items-end gap-x-2">
            <TextInput
              label="Campaign name"
              readOnly
              value={data.name}
              className="flex-[3]"
            />
            <SegmentedControl
              readOnly
              value={data.type}
              className="h-fit flex-[2]"
              data={[
                { label: "Private", value: "PRIVATE" },
                { label: "Shared", value: "SHARE" },
              ]}
            />
          </div>
          <div className="flex items-end gap-x-2">
            <DateTimePicker
              label="From"
              classNames={{
                input: "!py-0",
              }}
              disabled
              value={data.from ? new Date(data.from) : undefined}
              className="h-fit flex-1"
            />
            <DateTimePicker
              label="To"
              classNames={{
                input: "!py-0",
              }}
              disabled
              value={data.to ? new Date(data.to) : undefined}
              className="h-fit flex-1"
            />
          </div>
          <Textarea label="Description" readOnly value={data.description} />
        </div>
        <div className="flex-[2] p-4">
          <Timeline active={0} bulletSize={18} lineWidth={2}>
            {finalHistory.map((step) => (
              <Timeline.Item
                key={step.eventTime}
                title={`${step.action} - ${step.updatedBy}`}
              >
                <Text c="dimmed" size="sm">
                  {step.message}
                </Text>
                <Text size="xs" mt={4}>
                  {step.eventTime}
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    </div>
  );
}

function EditCampaignGeneralInfo({
  data,
  campaignId,
}: {
  campaignId: string;
  data: Pick<
    CampaignDetail,
    "name" | "description" | "campaignHistories" | "type" | "from" | "to"
  >;
}) {
  const queryClient = useQueryClient();
  const form = useForm<{
    name: string;
    description?: string;
    type: "SHARE" | "PRIVATE";
    from?: Date;
    to?: Date;
  }>({
    initialValues: {
      ...data,
      from: data.from ? new Date(data.from) : undefined,
      to: data.to ? new Date(data.to) : undefined,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: campaignInfoValidation,
  });

  const editInfoMutation = useMutation({
    mutationFn: async () => {
      const campaignRes = queryClient.getQueryData<
        CommonResponseBase<CampaignDetail>
      >([ARTIST_CAMPAIGN_ENDPOINT, { id: campaignId }]);
      if (!campaignRes?.data) return;
      const res = await updateCampaignGeneralInfoApi(campaignRes.data, {
        ...form.values,
        from: form.values?.from?.toISOString(),
        to: form.values?.to?.toISOString(),
      });

      if (res?.data?.status !== 200) {
        throw res.data;
      }

      return res.data;
    },
    onSuccess: (data) => {
      notifications.show({
        message: "Chỉnh sửa thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      modals.close("edit-campaign-info-" + campaignId);
      queryClient.setQueryData(
        [ARTIST_CAMPAIGN_ENDPOINT, { id: campaignId }],
        data
      );
    },
    onError: () => {
      notifications.show({
        message: "Chỉnh sửa thất bại! Vui lòng thử lại!",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
      queryClient.refetchQueries([
        ARTIST_CAMPAIGN_ENDPOINT,
        { id: campaignId },
      ]);
    },
  });

  useEffect(() => {
    form.setValues({
      ...data,
      from: data.from ? new Date(data.from) : undefined,
      to: data.to ? new Date(data.to) : undefined,
    });
  }, [data]);

  return (
    <form onSubmit={form.onSubmit(() => editInfoMutation.mutateAsync())}>
      <div className="flex flex-col space-y-4 mt-6">
        <div className="flex items-end gap-x-2">
          <TextInput
            label="Campaign name"
            {...form.getInputProps("name")}
            className="flex-[3]"
          />
          <SegmentedControl
            {...form.getInputProps("type")}
            className="h-fit flex-[2]"
            data={[
              { label: "Private", value: "PRIVATE" },
              { label: "Shared", value: "SHARE" },
            ]}
          />
        </div>
        <div className="flex gap-x-2">
          <DateTimePicker
            label="From"
            classNames={{
              input: "!py-0",
            }}
            popoverProps={{
              classNames: {
                dropdown: "z-10",
              },
            }}
            {...form.getInputProps("from")}
            className="h-fit flex-1"
          />
          <DateTimePicker
            label="To"
            classNames={{
              input: "!py-0",
            }}
            popoverProps={{
              classNames: {
                dropdown: "z-10",
              },
            }}
            {...form.getInputProps("to")}
            className="h-fit flex-1"
          />
        </div>
        <Textarea label="Description" {...form.getInputProps("description")} />
      </div>
      <div className="w-full flex justify-end">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
