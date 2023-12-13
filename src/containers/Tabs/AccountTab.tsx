import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { NOTIFICATION_TYPE } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import { publicUploadFile } from "@/services/backend/services/media";
import { updateUserProfileApi } from "@/services/backend/services/user";
import { $user, setUser } from "@/store/user";
import { User } from "@/types/User";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
import { editProfileValidation } from "@/validation/account";
import { Button, Grid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

export default function AccountTab() {
  const form = useForm<{
    displayName?: string;
    email?: string;
    avatar?: string | File;
  }>({
    initialValues: {
      displayName: $user.get()?.displayName,
      email: $user.get()?.email,
      avatar: $user.get()?.avatarUrl,
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: editProfileValidation,
  });

  const updateUserProfileMutation = useMutation({
    mutationFn: async (values: {
      displayName?: string;
      email?: string;
      avatar?: string | File;
    }) => {
      if (!values.displayName) return;
      let avatarUrl = $user.get()?.avatarUrl;
      if (values.avatar instanceof File) {
        const res = await publicUploadFile([values.avatar]);

        avatarUrl = res?.data.data.fileResponses[0].presignedUrl;
      } else if (!values.avatar) {
        avatarUrl = undefined;
      }

      const res = await updateUserProfileApi({
        avatarUrl: avatarUrl,
        displayName: values.displayName,
        email: values.email,
      });

      //refresh token
      await axiosClient.post("/auth/refresh");

      setUser({
        ...($user.get() ?? {}),
        ...res.data.data,
      } as User);
      form.resetDirty();
    },
    onSuccess: () => {
      notifications.show({
        message: "Cập nhật thông tin thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  return (
    <div className="user-profile-page px-6">
      <div>Hồ sơ của tôi</div>
      <div className="text-sm">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </div>
      {/* <Divider className="mt-4" /> */}
      <form
        className="mt-8 flex gap-x-4"
        onSubmit={form.onSubmit((values) =>
          updateUserProfileMutation.mutate(values)
        )}
      >
        <div className="w-64">
          <Thumbnail
            url={
              //@ts-ignore
              typeof form.values.avatar === "string"
                ? form.values.avatar
                : form.values.avatar
                ? URL.createObjectURL(form.values.avatar as Blob)
                : undefined
            }
            setFile={(file) => {
              form.setFieldValue("avatar", file);
            }}
            defaultPlaceholder={
              <div className="flex flex-col items-center">
                <p className="text-4xl font-thin">+</p>
                <p>Add avatar</p>
              </div>
            }
            clearable
            onClear={() => {
              form.setFieldValue("avatar", undefined);
            }}
          />
        </div>
        <div className="flex-1">
          <Grid align="center">
            <Grid.Col span={2} className="text-end mb-4">
              Username:
            </Grid.Col>
            <Grid.Col span={9} className="mb-4">
              <TextInput
                disabled
                autoComplete="username"
                value={$user.get()?.username}
              />
            </Grid.Col>
            <Grid.Col span={2} className="text-end mb-4">
              Display name:
            </Grid.Col>
            <Grid.Col span={9} className="mb-4">
              <TextInput
                autoComplete="username"
                {...form.getInputProps("displayName")}
              />
            </Grid.Col>
            <Grid.Col span={2} className="text-end">
              Email:
            </Grid.Col>
            <Grid.Col span={9}>
              {" "}
              <TextInput
                autoComplete="email"
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={11} className="text-end mt-2">
              <Button
                type="submit"
                disabled={!form.isDirty()}
                loading={updateUserProfileMutation.isLoading}
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
