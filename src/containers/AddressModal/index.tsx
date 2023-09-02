import { CheckoutContext } from "@/contexts/CheckoutContext";
import { UserAddress } from "@/types/User";
import { Badge, Checkbox } from "@mantine/core";
import { useContext, useState } from "react";
import CreateUpdateAddressModal from "../CreateUpdateAddressModal";
import useAddress from "@/hooks/useAddress";

export default function AddressModal() {
  const { addresses, mutate } = useAddress();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>();

  const switchEditStatus = (address: UserAddress) => {
    setIsEdit((prev) => !prev);
    setSelectedAddress(address);
  };

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
              switchEditStatus={() => switchEditStatus(address)}
              key={address.id}
              id={address.id}
              address={address}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const AddressOption = ({
  id,
  address,
  switchEditStatus,
}: {
  id: string;
  address: UserAddress;
  switchEditStatus: () => void;
}) => {
  const { selectedAddressId, setSelectedAddressId } =
    useContext(CheckoutContext);
  return (
    <div className="address-option flex justify-between my-3">
      <div className="flex">
        <div className="mr-3">
          <Checkbox
            checked={id === selectedAddressId}
            onChange={() => setSelectedAddressId(id)}
          />
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
