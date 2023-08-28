import useAddress from "@/hooks/useAddress";
import { Modal, Divider, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddressModal from "../AddressModal";
import { useContext, useEffect, useMemo } from "react";
import { CheckoutContext } from "@/contexts/CheckoutContext";

export default function CheckoutAddress() {
  const addresses = useAddress();
  const [opened, { open, close }] = useDisclosure(false);

  const { selectedAddressId, setSelectedAddressId } =
    useContext(CheckoutContext);

  useEffect(() => {
    setSelectedAddressId(
      addresses?.find((address) => address.isDefault)?.id ?? ""
    );
  }, [addresses, setSelectedAddressId]);

  const selectedAddress = useMemo(
    () => addresses?.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  return (
    <div className="checkout-address">
      <div>
        <Modal
          className="[&_.mantine-Modal-header]:font-bold"
          opened={opened}
          onClose={close}
          title="Địa chỉ của tôi"
        >
          <Divider />
          <AddressModal addresses={addresses ?? []} />
        </Modal>
      </div>
      <div className="flex justify-between mb-4 text-secondary font-bold">
        <div className="text-2xl">Địa chỉ giao hàng</div>
        <div className="cursor-pointer" onClick={open}>
          Edit
        </div>
      </div>
      <div className="font-bold mb-2">
        <span className="mr-3">Customer name</span> <span>0942734768</span>
      </div>
      <div>
        {selectedAddress?.isDefault && <Badge className="mr-3">Mặc định</Badge>}
        <Badge className="mr-5">{selectedAddress?.type}</Badge>
        <span>{selectedAddress?.address}</span>
      </div>
    </div>
  );
}
