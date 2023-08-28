import { CheckoutContext } from "@/contexts/CheckoutContext";
import { UserAddress } from "@/types/User";
import { Badge, Checkbox } from "@mantine/core";
import { useContext, useState } from "react";

export default function AddressModal({
  addresses,
}: {
  addresses: UserAddress[];
}) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="address-modal py-4">
      {addresses?.map((address) => (
        <AddressOption key={address.id} id={address.id} address={address} />
      ))}
    </div>
  );
}

const AddressOption = ({
  id,
  address,
}: {
  id: string;
  address: UserAddress;
}) => {
  const { selectedAddressId, setSelectedAddressId } =
    useContext(CheckoutContext);

  return (
    <div className="address-option flex justify-between">
      <div className="flex">
        <div className="mr-3">
          <Checkbox
            checked={id === selectedAddressId}
            onChange={() => setSelectedAddressId(id)}
          />
        </div>
        <div>
          <div>
            <span className="font-bold text-xl">Username</span> | 0942734768
          </div>
          <div className="my-2">{address.address}</div>
          <div>
            {address.isDefault && <Badge className="mr-3">Mặc định</Badge>}
            <Badge>{address.type}</Badge>
          </div>
        </div>
      </div>
      <div className="cursor-pointer">Cập nhật</div>
    </div>
  );
};
