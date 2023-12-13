import { NOTIFICATION_TYPE } from "@/constants/common";
import { publicUploadFile } from "@/services/backend/services/media";
import { artistRegister } from "@/services/backend/services/user";
import { ArtistRegisterData } from "@/types/User";
import { getNotificationIcon } from "@/utils/mapper";
import { updateUserInformation } from "@/utils/user";
import { artistRegisterValidation } from "@/utils/validations";
import { Button, FileInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export default function ArtistRegisterModal({
  closeModal,
  revalidateFunc,
}: {
  closeModal: () => void;
  revalidateFunc?: () => void;
}) {
  const initialValues = {
    bankAccount: "",
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

  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler = async (values: ArtistRegisterData) => {
    if (file == null) {
      notifications.show({
        message: "Xin hãy upload ảnh shop của bạn",
        ...getNotificationIcon(NOTIFICATION_TYPE["FAILED"]),
      });
    }

    setLoading(true);

    if (file != null) {
      const data = (await publicUploadFile([file]))?.data?.data;

      if (data?.fileResponses && data.fileResponses.length > 0) {
        const result = await artistRegister({
          ...values,
          shopThumbnailUrl: data.fileResponses[0].presignedUrl,
        });

        let isSuccess = result != null;
        notifications.show({
          message: isSuccess
            ? "Đăng ký trở thành artist thành công"
            : "Đăng ký trở thành artist thất bại! Vui lòng thử lại!",
          ...getNotificationIcon(
            NOTIFICATION_TYPE[isSuccess ? "SUCCESS" : "FAILED"]
          ),
        });

        if (isSuccess) {
          revalidateFunc?.();
          updateUserInformation();
          closeModal();
        }
      }
    }

    setLoading(false);
  };
  return (
    <div className="create-address-modal">
      <form onSubmit={onSubmit(submitHandler)}>
        <TextInput
          className="my-4"
          label="Số tài khoản ngân hàng"
          withAsterisk
          {...getInputProps("bankAccount")}
          disabled={loading}
        />
        <TextInput
          className="my-4"
          label="Tên tài khoản ngân hàng"
          withAsterisk
          {...getInputProps("bankName")}
          disabled={loading}
        />
        <TextInput
          className="my-4"
          label="Mô tả về bản thân"
          withAsterisk
          {...getInputProps("description")}
          disabled={loading}
        />
        <TextInput
          className="my-4"
          label="Điền số điện thoại của shop tại đây"
          withAsterisk
          {...getInputProps("phone")}
          disabled={loading}
        />
        <FileInput
          className="my-4"
          label="Điền ảnh của shop tại đây"
          value={file}
          onChange={setFile}
        />
        <div className="mt-6 btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0">
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={closeModal}
          >
            Trở về
          </Button>
          <Button
            className="bg-primary !text-white"
            type="submit"
            loading={loading}
          >
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
}
