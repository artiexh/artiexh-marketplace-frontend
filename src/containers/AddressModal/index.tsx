import useAddress from "@/hooks/useAddress";
import { Address } from "@/types/User";
import { Badge, Button, Checkbox } from "@mantine/core";
import { useState } from "react";
import CreateUpdateAddressModal from "../CreateUpdateAddressModal";

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
}: {
  id: string;
  address: Address;
  switchEditStatus: () => void;
  isChecked?: boolean;
  onChange: (id: string) => void;
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
      <div className="cursor-pointer" onClick={switchEditStatus}>
        Cập nhật
      </div>
    </div>
  );
};
