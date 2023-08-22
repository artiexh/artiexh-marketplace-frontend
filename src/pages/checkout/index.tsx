import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Divider } from "@mantine/core";
import CartSection from "@/components/CartSection/CartSection";
import cashPaymentImg from "../../../public/assets/cash.svg";
import vnpayImg from "../../../public/assets/vn_pay.svg";
import Image from "next/image";
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import { useState } from "react";

const PAYMENT_ITEM = [
  {
    imgUrl: cashPaymentImg,
    title: "VNPay Wallet",
    key: "vnpay",
  },
  {
    imgUrl: vnpayImg,
    title: "By cash",
    key: "by_cash",
  },
];

export default function CheckoutPage() {
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  );

  console.log(selectedItems);
  if (selectedItems.length === 0) {
    return <>Please add item to your cart!</>;
  }

  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("");

  const flattedItems = selectedItems.map((item) => item.items).flat();
  const isChecked = (id: string) => {
    return flattedItems.some((cartItem) => cartItem.id == id);
  };
  const total = flattedItems.reduce(
    (acc, item) => acc + item.price.amount * item.quantity,
    0
  );

  return (
    <div className="checkout-page lg:flex gap-16">
      <div className="checkout-items flex-1">
        <div className="bg-white p-6">
          <div className="flex justify-between mb-4 text-secondary font-bold">
            <div className="text-2xl">Địa chỉ giao hàng</div>
            <div>Edit</div>
          </div>
          <div className="font-bold mb-2">
            <span className="mr-3">Customer name</span> <span>0942734768</span>
          </div>
          <div>
            <Badge className="mr-3">Mặc định</Badge>
            <Badge className="mr-5">Office</Badge>
            <span>39/7 Street name, District Name, City Name</span>
          </div>
        </div>
        <div className="mt-10">
          {selectedItems.map((cartSection, idx) => (
            <div
              key={idx}
              className="bg-white mt-10 p-2 sm:p-6 rounded-sm relative"
            >
              <CartSection
                isCartPage={false}
                cartSection={cartSection}
                dispatch={dispatch}
                isChecked={isChecked}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className="payment-sections bg-white p-6 lg:w-[30vw] mt-10 md:mt-0"
        style={{ height: "fit-content" }}
      >
        <div className="text-2xl font-bold mb-8">Select payment method</div>
        <div>
          {PAYMENT_ITEM.map((item) => (
            <div
              key={item.title}
              className="relative grid grid-cols-3 items-center border-[0.2px] border-black my-4 rounded-lg p-2"
              onClick={() =>
                setPaymentMethod(item.key === paymentMethod ? "" : item.key)
              }
            >
              <div className="col-span-1 flex justify-center">
                <Image
                  width={50}
                  height={50}
                  src={item.imgUrl}
                  alt="payment_logo"
                />
              </div>
              <div className="col-span-2">{item.title}</div>
              <LogoCheckbox
                configClass="absolute right-4"
                clickEvent={() => {}}
                isChecked={paymentMethod === item.key}
              />
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mt-10 mb-4">Order Summary</div>
        <div className="flex justify-between">
          <div>Subtotal {`(${flattedItems.length} items)`}</div>
          <div>{`${total}  ${flattedItems[0].price.unit}`}</div>
        </div>
        <Divider className="my-2" />
        <div className="flex justify-between">
          <div>Total</div>
          <div>{`${total}  ${flattedItems[0].price.unit}`}</div>
        </div>
        <div className="flex justify-center mt-10 mb-4">
          <Button style={{ width: "80%", height: 45 }} className="bg-primary">
            Proceed to payment
          </Button>
        </div>
      </div>
    </div>
  );
}
