import { NOTIFICATION_TYPE } from "@/constants/common";
import axiosClient from "@/services/backend/axiosClient";
import { publicUploadFile } from "@/services/backend/services/media";
import { artistRegister, logout } from "@/services/backend/services/user";
import { ArtistRegisterData } from "@/types/User";
import { ValidationError } from "@/utils/error/ValidationError";
import { errorHandler } from "@/utils/errorHandler";
import { getNotificationIcon } from "@/utils/mapper";
import { updateUserInformation } from "@/utils/user";
import { artistRegisterValidation } from "@/utils/validations";
import { Button, FileInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ArtistRegisterModal({
  closeModal,
  revalidateFunc,
}: {
  closeModal: () => void;
  revalidateFunc?: () => void;
}) {
  const router = useRouter();
  const initialValues = {
    bankAccount: "",
    bankAccountName: "",
    bankName: "",
    description: "",
    phone: "",
    shopThumbnailUrl: "",
  };

  const [file, setFile] = useState<File | null>(null);

  const { getInputProps, onSubmit } = useForm({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: artistRegisterValidation,
  });

  const registerArtistMutation = useMutation({
    mutationFn: async (values: ArtistRegisterData) => {
      console.log("test");
      if (file == null) {
        throw new ValidationError("Xin hãy upload ảnh shop của bạn");
      }

      const data = (await publicUploadFile([file]))?.data?.data;

      if (data?.fileResponses && data.fileResponses.length > 0) {
        const result = await artistRegister({
          ...values,
          shopThumbnailUrl: data.fileResponses[0].presignedUrl,
        });
      } else {
        throw new Error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    },
    onSuccess: () => {
      notifications.show({
        message: "Đăng ký trở thành artist thành công, vui long đăng nhập lại",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      revalidateFunc?.();
      logout().then(() => {
        router.push("/auth/signin");
      });
      closeModal();
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  return (
    <div className="create-address-modal">
      <form
        onSubmit={onSubmit((values) => registerArtistMutation.mutate(values))}
      >
        <TextInput
          className="my-4"
          label="Tên ngân hàng"
          withAsterisk
          {...getInputProps("bankName")}
          disabled={registerArtistMutation.isLoading}
        />
        <TextInput
          className="my-4"
          label="Số tài khoản ngân hàng"
          withAsterisk
          {...getInputProps("bankAccount")}
          disabled={registerArtistMutation.isLoading}
        />
        <TextInput
          className="my-4"
          label="Chủ tài khoản"
          withAsterisk
          {...getInputProps("bankAccountName")}
          disabled={registerArtistMutation.isLoading}
        />
        <TextInput
          className="my-4"
          label="Mô tả về bản thân"
          withAsterisk
          {...getInputProps("description")}
          disabled={registerArtistMutation.isLoading}
        />
        <TextInput
          className="my-4"
          label="Điền số điện thoại của shop tại đây"
          withAsterisk
          {...getInputProps("phone")}
          disabled={registerArtistMutation.isLoading}
        />
        <FileInput
          className="my-4"
          label="Điền ảnh của shop tại đây"
          value={file}
          onChange={setFile}
        />
        <div className="mt-6 btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0">
          <Button
            className="bg-primary !text-white"
            type="submit"
            loading={registerArtistMutation.isLoading}
          >
            Đăng ký
          </Button>
        </div>
      </form>
    </div>
  );
}
