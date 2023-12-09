"use client";

import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { NOTIFICATION_TYPE } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import { publicUploadFile } from "@/services/backend/services/media";
import { updateShopProfileApi } from "@/services/backend/services/user";
import { $user } from "@/store/user";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
import { editShopValidation } from "@/validation/account";
import { Button, Grid, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useStore } from "@nanostores/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export default function MyShopProfilePage() {
  const user = useStore($user);
  const firstTime = useRef(true);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["aritst", { id: user?.username }],
    queryFn: async () => {
      const res = await axiosClient.get(`/artist/${user?.username}`);

      return res.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (values: {
      bankAccount?: string;
      bankName?: string;
      phone?: string;
      shopThumbnail: string | File | null;
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
      refetch();
      notifications.show({
        message: "Thay đổi thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  if (isLoading) return null;

  return (
    <div className="user-profile-page px-6">
      <div>Hồ sơ shop</div>
      <ShopProfileForm
        data={data.data}
        onSubmit={(values) => updateProfileMutation.mutate(values)}
        loading={updateProfileMutation.isLoading}
      />
      {/* <Divider className="mt-4" /> */}
    </div>
  );
}

function ShopProfileForm({
  loading = false,
  data,
  onSubmit,
}: {
  loading?: boolean;
  data: any;
  onSubmit: (value: {
    bankAccount?: string;
    bankName?: string;
    phone?: string;
    shopThumbnail: string | File | null;
    description?: string;
  }) => void;
}) {
  const form = useForm<{
    bankAccount?: string;
    bankName?: string;
    phone?: string;
    shopThumbnail: string | File | null;
    description?: string;
  }>({
    initialValues: {
      bankAccount: data.bankAccount,
      bankName: data.bankName,
      phone: data.phone,
      shopThumbnail: data.shopThumbnailUrl,
      description: data.description,
    },
    validateInputOnChange: true,
    validate: editShopValidation,
  });

  return (
    <form
      className="mt-8 flex flex-col gap-y-4"
      onSubmit={form.onSubmit(onSubmit)}
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
              form.setFieldValue("shopThumbnail", file);
            }}
            defaultPlaceholder={
              <div className="flex flex-col items-center">
                <p className="text-4xl font-thin">+</p>
                <p>Add shop thumbnail</p>
              </div>
            }
            clearable
            onClear={() => {
              form.setFieldValue("shopThumbnail", null);
            }}
          />
        </div>

        <Input.Wrapper label="Description" error={form.errors["description"]}>
          <Input {...form.getInputProps("description")} />
        </Input.Wrapper>
      </div>
      <div className="flex-1">
        <h2 className="font-semibold text-lg">Thông tin shop</h2>
        <Grid align="center">
          <Grid.Col span={6}>
            <Input.Wrapper
              label="Bank account"
              error={form.errors["bankAccount"]}
            >
              <Input {...form.getInputProps("bankAccount")} />
            </Input.Wrapper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Input.Wrapper label="Bank name" error={form.errors["bankName"]}>
              <Input {...form.getInputProps("bankName")} />
            </Input.Wrapper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Input.Wrapper label="Phone number" error={form.errors["phone"]}>
              <Input {...form.getInputProps("phone")} />
            </Input.Wrapper>
          </Grid.Col>

          <Grid.Col span={12} className="text-end mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary !text-white"
            >
              Update
            </Button>
          </Grid.Col>
        </Grid>
      </div>
    </form>
  );
}
