import { ADDRESS_TYPE, NOTIFICATION_TYPE } from "@/constants/common";
import {
  createUserAddress,
  updateUserAddress,
} from "@/services/backend/services/user";
import { CreateUserAddress, Address } from "@/types/User";
import { createUpdateAddressValidation } from "@/utils/validations";
import { TextInput, Select, Button, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import WardSelects from "../WardSelects";
import { notifications } from "@mantine/notifications";
import {
  fromUserAddressToDefaultAddressFormValue,
  getNotificationIcon,
} from "@/utils/mapper";

export default function CreateUpdateAddressModal({
  closeModal,
  isCreate = true,
  address,
  revalidateFunc,
}: {
  closeModal: () => void;
  initialValues?: CreateUserAddress;
  isCreate?: boolean;
  address?: Address;
  revalidateFunc?: () => void;
}) {
  const initialValues = address
    ? fromUserAddressToDefaultAddressFormValue(address)
    : {
        address: "",
        isDefault: true,
        phone: "",
        receiverName: "",
        type: ADDRESS_TYPE.HOME,
        wardId: "",
      };

  const { getInputProps, onSubmit } = useForm({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: createUpdateAddressValidation,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler = async (values: CreateUserAddress) => {
    setLoading(true);
    const result = await (isCreate
      ? createUserAddress(values)
      : updateUserAddress(values, address?.id ?? ""));

    let isSuccess = result != null;
    notifications.show({
      message: isSuccess
        ? "Địa chỉ của bạn đã được thêm thành công"
        : "Thêm địa chỉ thất bại! Vui lòng thử lại!",
      ...getNotificationIcon(
        NOTIFICATION_TYPE[isSuccess ? "SUCCESS" : "FAILED"]
      ),
    });
    revalidateFunc?.();
    closeModal();
    setLoading(false);
  };
  return (
    <div className="create-address-modal">
      <form onSubmit={onSubmit(submitHandler)}>
        <TextInput
          className="my-4"
          label="Điền địa chỉ tại đây"
          withAsterisk
          {...getInputProps("address")}
          disabled={loading}
        />
        <WardSelects getInputProps={getInputProps} ward={address?.ward} />
        <TextInput
          className="my-4"
          label="Điền tên người nhận tại đây"
          withAsterisk
          {...getInputProps("receiverName")}
          disabled={loading}
        />
        <TextInput
          className="my-4"
          label="Điền số điện thoại tại đây"
          withAsterisk
          {...getInputProps("phone")}
          disabled={loading}
        />
        <Select
          className="my-4"
          label="Chọn loại địa chỉ"
          placeholder="Pick one"
          defaultValue={initialValues.type}
          data={[
            { value: ADDRESS_TYPE.HOME, label: "Nhà ở" },
            { value: ADDRESS_TYPE.OFFICE, label: "Cơ quan" },
          ]}
        />
        <Checkbox
          label="Đặt làm địa chỉ mặc định"
          {...getInputProps("isDefault")}
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
            {isCreate ? "Tạo" : "Lưu"}
          </Button>
        </div>
      </form>
    </div>
  );
}
