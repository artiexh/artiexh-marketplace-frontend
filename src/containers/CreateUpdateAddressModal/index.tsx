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
import { errorHandler } from "@/utils/errorHandler";
import { useMutation } from "@tanstack/react-query";

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

  const { getInputProps, onSubmit, values } = useForm({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: createUpdateAddressValidation,
  });

  const submitHandlerMutation = useMutation({
    mutationFn: async (values: CreateUserAddress) => {
      const result = await (isCreate
        ? createUserAddress(values)
        : updateUserAddress(values, address?.id ?? ""));
    },
    onSuccess: () => {
      notifications.show({
        message: "Địa chỉ của bạn đã được thêm thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      revalidateFunc?.();
      closeModal();
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  return (
    <div className="create-address-modal">
      <form
        onSubmit={onSubmit((values) => submitHandlerMutation.mutate(values))}
      >
        <TextInput
          className="my-4"
          label="Điền tên người nhận tại đây"
          withAsterisk
          {...getInputProps("receiverName")}
          disabled={submitHandlerMutation.isLoading}
        />

        <WardSelects getInputProps={getInputProps} ward={address?.ward} />
        <TextInput
          className="my-4"
          label="Điền địa chỉ tại đây"
          withAsterisk
          {...getInputProps("address")}
          disabled={submitHandlerMutation.isLoading}
        />
        <TextInput
          className="my-4"
          label="Điền số điện thoại tại đây"
          withAsterisk
          {...getInputProps("phone")}
          disabled={submitHandlerMutation.isLoading}
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
          checked={values.isDefault}
          {...getInputProps("isDefault")}
        />
        <div className="mt-6 btn-wrapper flex flex-col-reverse md:flex-row gap-5 w-full md:w-max ml-auto bg-white p-5 rounded-lg md:bg-transparent sm:p-0">
          <Button
            variant="outline"
            type="button"
            disabled={submitHandlerMutation.isLoading}
            onClick={closeModal}
          >
            Trở về
          </Button>
          <Button
            className="bg-primary !text-white"
            type="submit"
            loading={submitHandlerMutation.isLoading}
          >
            {isCreate ? "Tạo" : "Lưu"}
          </Button>
        </div>
      </form>
    </div>
  );
}
