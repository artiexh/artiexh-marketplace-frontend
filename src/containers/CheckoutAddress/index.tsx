import useAddress from "@/hooks/useAddress";
import { Modal, Divider, Badge, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddressModal from "../AddressModal";
import { useContext, useEffect, useMemo } from "react";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import CreateUpdateAddressModal from "../CreateUpdateAddressModal";

export default function CheckoutAddress() {
  const { addresses, mutate } = useAddress();
  const [opened, { open, close }] = useDisclosure(false);

  const { selectedAddressId, setSelectedAddressId } =
    useContext(CheckoutContext);

  const [createOpened, { open: createOpen, close: createClose }] =
    useDisclosure(false);

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
          zIndex={1000}
          opened={createOpened}
          onClose={createClose}
          title="Địa chỉ của tôi"
          size={"lg"}
        >
          <Divider />
          <CreateUpdateAddressModal
            closeModal={createClose}
            revalidateFunc={mutate}
          />
        </Modal>
        <Modal
          className="[&_.mantine-Modal-header]:font-bold"
          opened={opened}
          onClose={close}
          title="Danh sách địa chỉ"
          size={"lg"}
        >
          <Divider />

          <AddressModal
            defaultValue={selectedAddressId}
            submitHandler={(id) => {
              setSelectedAddressId(id);
              close();
            }}
          />
          <div className="w-full mt-4">
            <span>Địa chỉ không phù hợp?</span>{" "}
            <strong
              onClick={createOpen}
              className="text-primary cursor-pointer"
            >
              Thêm địa chỉ
            </strong>
          </div>
        </Modal>
      </div>
      <div className="flex justify-between mb-4 text-secondary font-bold">
        <div className="text-2xl">Địa chỉ giao hàng</div>
        {selectedAddress && (
          <div className="cursor-pointer" onClick={open}>
            Edit
          </div>
        )}
      </div>
      {selectedAddress ? (
        <>
          <div className="font-bold mb-2">
            <span className="mr-3">{selectedAddress.receiverName}</span>{" "}
            <span>{selectedAddress.phone}</span>
          </div>
          <div>
            {selectedAddress?.isDefault && (
              <Badge className="mr-3">Mặc định</Badge>
            )}
            <Badge className="mr-5">{selectedAddress?.type}</Badge>
            <span>{selectedAddress?.address}</span>
          </div>
        </>
      ) : (
        <>
          <div>
            Hiện tại bạn chưa tạo địa chỉ nhận hàng của mình!{" "}
            <span
              className="font-bold text-primary cursor-pointer"
              onClick={createOpen}
            >
              Ấn vào link này để tạo ngay!
            </span>
          </div>
        </>
      )}
    </div>
  );
}
