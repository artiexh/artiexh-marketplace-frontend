import useAddress from "@/hooks/useAddress";
import { Address } from "@/types/User";
import { Badge, Button, Checkbox } from "@mantine/core";
import { useState } from "react";
import CreateUpdateAddressModal from "../CreateUpdateAddressModal";
import axiosClient from "@/services/backend/axiosClient";
import { useMutation } from "@tanstack/react-query";
import { errorHandler } from "@/utils/errorHandler";
import { notifications } from "@mantine/notifications";
import { getNotificationIcon } from "@/utils/mapper";
import { NOTIFICATION_TYPE } from "@/constants/common";

export default function AddressModal({
  submitHandler,
  defaultValue,
}: {
  submitHandler: (id: string) => void;
  defaultValue?: string;
}) {
  const { addresses, mutate } = useAddress();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const switchEditStatus = (address: Address) => {
    setIsEdit((prev) => !prev);
    setSelectedAddress(address);
  };

  const [currentAddressId, setCurrentAddressId] = useState<string | undefined>(
    defaultValue
  );

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`/user/address/${id}`);
    },
    onSuccess: () => {
      notifications.show({
        message: "Xoá địa chỉ thành công",
        ...getNotificationIcon(NOTIFICATION_TYPE.SUCCESS),
      });
      mutate();
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  return (
    <div className="address-modal py-4">
      {isEdit ? (
        <>
          <CreateUpdateAddressModal
            closeModal={() => setIsEdit(false)}
            isCreate={false}
            address={selectedAddress}
            revalidateFunc={mutate}
          />
        </>
      ) : (
        <div>
          {addresses?.map((address) => (
            <AddressOption
              isChecked={currentAddressId === address.id}
              switchEditStatus={() => switchEditStatus(address)}
              key={address.id}
              id={address.id}
              address={address}
              onChange={(id) => setCurrentAddressId(id)}
              onDelete={
                addresses.length > 1 && address.id !== defaultValue
                  ? (id) => deleteAddressMutation.mutate(id)
                  : undefined
              }
            />
          ))}
          <div className="w-full flex justify-end">
            <Button
              variant="outline"
              disabled={!currentAddressId}
              onClick={() =>
                currentAddressId && submitHandler(currentAddressId)
              }
            >
              Lưu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const AddressOption = ({
  id,
  address,
  switchEditStatus,
  isChecked,
  onChange,
  onDelete,
}: {
  id: string;
  address: Address;
  switchEditStatus: () => void;
  isChecked?: boolean;
  onChange: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  return (
    <div className="address-option flex justify-between my-3">
      <div className="flex">
        <div className="mr-3">
          <Checkbox checked={isChecked} onChange={() => onChange(id)} />
        </div>
        <div>
          <div>
            <span className="font-bold text-lg">{address.receiverName}</span> |{" "}
            {address.phone}
          </div>
          <div className="my-2">{address.address}</div>
          <div>
            {address.isDefault && <Badge className="mr-3">Mặc định</Badge>}
            <Badge>{address.type}</Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4">
        {!isChecked && onDelete && (
          <div
            className="cursor-pointer text-red-500"
            onClick={() => onDelete(id)}
          >
            Xoá
          </div>
        )}
        <div className="cursor-pointer" onClick={switchEditStatus}>
          Cập nhật
        </div>
      </div>
    </div>
  );
};
