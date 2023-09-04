import { NOTIFICATION_TYPE } from "@/constants/common";
import { artistRegister } from "@/services/backend/services/user";
import { ArtistRegisterData } from "@/types/User";
import { artistRegisterValidation } from "@/utils/validations";
import { TextInput, Button, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import WardSelects from "../WardSelects";
import { notifications } from "@mantine/notifications";
import { getNotificationIcon } from "@/utils/mapper";
import { publicUploadFile } from "@/services/backend/services/media";

export default function ArtistRegisterModal({
  closeModal,
  revalidateFunc,
}: {
  closeModal: () => void;
  revalidateFunc?: () => void;
}) {
  const initialValues = {
    shopAddress: "",
    shopImageUrl: "",
    shopName: "",
    shopPhone: "",
    shopWardId: "",
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
          shopImageUrl: data.fileResponses[0].presignedUrl,
        });

        let isSuccess = result != null;
        notifications.show({
          message: isSuccess
            ? "Địa chỉ của bạn đã được thêm thành công"
            : "Thêm địa chỉ thất bại! Vui lòng thử lại!",
          ...getNotificationIcon(
            NOTIFICATION_TYPE[isSuccess ? "SUCCESS" : "FAILED"]
          ),
        });

        if (isSuccess) {
          revalidateFunc?.();
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
          label="Điền địa chỉ của shop tại đây"
          withAsterisk
          {...getInputProps("shopAddress")}
          disabled={loading}
        />
        <WardSelects getInputProps={getInputProps} fieldName={"shopWardId"} />
        <TextInput
          className="my-4"
          label="Điền tên của shop tại đây"
          withAsterisk
          {...getInputProps("shopName")}
          disabled={loading}
        />
        <FileInput
          className="my-4"
          label="Điền ảnh của shop tại đây"
          value={file}
          onChange={setFile}
        />
        <TextInput
          className="my-4"
          label="Điền số điện thoại của shop tại đây"
          withAsterisk
          {...getInputProps("shopPhone")}
          disabled={loading}
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
          <Button className="bg-primary" type="submit" loading={loading}>
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
}
