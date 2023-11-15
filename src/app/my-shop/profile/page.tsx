"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { NOTIFICATION_TYPE } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import { publicUploadFile } from "@/services/backend/services/media";
import { updateShopProfileApi } from "@/services/backend/services/user";
import { $user } from "@/store/user";
import { getNotificationIcon } from "@/utils/mapper";
import { editShopValidation } from "@/validation/account";
import { Button, Grid, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function MyShopProfilePage() {
  const user = useStore($user);

  const form = useForm<{
    bankAccount?: string;
    bankName?: string;
    phone?: string;
    shopThumbnail?: string | File;
    description?: string;
  }>({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: editShopValidation,
  });
  const { data } = useQuery({
    queryKey: ["aritst", { id: user?.username }],
    queryFn: async () => {
      const res = await axiosClient.get(`/artist/${user?.username}`);

      form.setValues({
        bankAccount: res.data.data.bankAccount,
        bankName: res.data.data.bankName,
        phone: res.data.data.phone,
        shopThumbnail: res.data.data.shopThumbnailUrl,
        description: res.data.data.description,
      });
      form.resetDirty();

      return res.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (values: {
      bankAccount?: string;
      bankName?: string;
      phone?: string;
      shopThumbnail?: string | File;
      description?: string;
    }) => {
      let shopThumbnailUrl = data.data.shopThumbnailUrl;
      if (values.shopThumbnail instanceof File) {
        const res = await publicUploadFile([values.shopThumbnail]);

        shopThumbnailUrl = res?.data.data.fileResponses[0].presignedUrl;
      } else if (!values.shopThumbnail) {
        shopThumbnailUrl = undefined;
      }

      const res = await updateShopProfileApi({
        bankAccount: values.bankAccount,
        bankName: values.bankName,
        phone: values.phone,
        shopThumbnailUrl: shopThumbnailUrl,
        description: values.description,
      });
    },
    onSuccess: () => {
      notifications.show({
        message: "Thay đổi thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      form.resetDirty();
    },
    onError: () => {
      notifications.show({
        message: "Thay đổi thất bại",
        ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
      });
    },
  });

  return (
    <div className="user-profile-page px-6">
      <div>Hồ sơ shop</div>

      {/* <Divider className="mt-4" /> */}
      <form
        className="mt-8 flex flex-col gap-y-4"
        onSubmit={form.onSubmit((values) =>
          updateProfileMutation.mutateAsync(values)
        )}
      >
        <div className="flex flex-col gap-y-4">
          <h2 className="font-semibold text-lg">Trang trí</h2>
          <div>
            <Thumbnail
              className="!h-[20rem]"
              url={
                //@ts-ignore
                typeof form.values.shopThumbnail === "string"
                  ? form.values.shopThumbnail
                  : form.values.shopThumbnail
                  ? URL.createObjectURL(form.values.shopThumbnail as Blob)
                  : undefined
              }
              setFile={(file) => {
                form.setFieldValue("avatar", file);
              }}
              defaultPlaceholder={
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-thin">+</p>
                  <p>Add shop thumbnail</p>
                </div>
              }
              clearable
              onClear={() => {
                form.setFieldValue("avatar", undefined);
              }}
            />
          </div>

          <Input.Wrapper label="Description">
            <Input {...form.getInputProps("description")} />
          </Input.Wrapper>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">Thông tin shop</h2>
          <Grid align="center">
            <Grid.Col span={6}>
              <Input.Wrapper label="Bank account">
                <Input {...form.getInputProps("bankAccount")} />
              </Input.Wrapper>
            </Grid.Col>

            <Grid.Col span={6}>
              <Input.Wrapper label="Bank name">
                <Input {...form.getInputProps("bankName")} />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Input.Wrapper label="Phone number">
                <Input {...form.getInputProps("phone")} />
              </Input.Wrapper>
            </Grid.Col>

            <Grid.Col span={12} className="text-end mt-2">
              <Button
                type="submit"
                disabled={!form.isDirty() || updateProfileMutation.isLoading}
                className="bg-primary !text-white"
              >
                Update
              </Button>
            </Grid.Col>
          </Grid>
        </div>
      </form>
    </div>
  );
}
