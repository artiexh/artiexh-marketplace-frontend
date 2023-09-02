import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, TextInput } from "@mantine/core";
import CartSectionComponent from "@/components/CartSection/CartSection";
import cashPaymentImg from "../../../public/assets/cash.svg";
import vnpayImg from "../../../public/assets/vn_pay.svg";
import Image from "next/image";
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import { useMemo, useState } from "react";
import axiosClient from "@/services/backend/axiosClient";
import { CartData, CartItem } from "@/services/backend/types/Cart";
import useSWR from "swr";
import { CartSection } from "@/services/backend/types/Cart";
import CheckoutAddress from "@/containers/CheckoutAddress";
import { checkout } from "@/services/backend/services/cart";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import { NOTIFICATION_TYPE, PAYMENT_METHOD_ENUM } from "@/constants/common";
import { clearItems } from "@/store/slices/cartSlice";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { IconSearchOff } from "@tabler/icons-react";
import { getNotificationIcon } from "@/utils/mapper";
import { notifications } from "@mantine/notifications";

const PAYMENT_ITEM = [
  // {
  //   imgUrl: cashPaymentImg,
  //   title: "By cash",
  //   key: "CASH",
  // },
  {
    imgUrl: vnpayImg,
    title: "VNPay Wallet",
    key: "VN_PAY",
  },
];

export default function CheckoutPage() {
  const selectedItems = useSelector(
    (state: RootState) => state.cart.selectedItems
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [noteValues, setNoteValues] = useState<
    {
      shopId: string;
      note: string;
    }[]
  >([]);

  const { data, mutate } = useSWR<CartData>("cart", async () => {
    try {
      const { data } = (await axiosClient("/cart"))?.data;
      return data;
    } catch (e) {
      return null;
    }
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const flattedItems = selectedItems.map((item) => item.items).flat();

  const isChecked = (id: string) => {
    return flattedItems.some((cartItem) => cartItem.id == id);
  };

  // the actual calculated selected data from api
  const selectedCartItems = useMemo(() => {
    const items: CartSection[] = [];
    // list cart item
    data?.shopItems.forEach((shopItem) => {
      flattedItems.forEach((item) => {
        const selectedProducts: CartItem[] = [];
        shopItem.items.forEach((i) => {
          if (item.id === i.id) {
            selectedProducts.push(i);
          }
        });

        if (selectedProducts.length > 0) {
          const findItem = items.find(
            (item) => item.shop.id === shopItem.shop.id
          );

          if (findItem != null) {
            findItem.items.push(...selectedProducts);
          } else {
            items.push({
              shop: shopItem.shop,
              items: selectedProducts,
            });
          }
        }
      });
    });
    return items;
  }, [data]);

  const flattedCheckoutItems = selectedCartItems
    .map((item) => item.items)
    .flat();

  const totalPrice = selectedCartItems?.reduce(
    (total, item) =>
      total +
      item.items.reduce(
        (acc, cartItem) => acc + cartItem.price.amount * cartItem.quantity,
        0
      ),
    0
  );

  const paymentSubmit = async () => {
    setLoading(true);
    const data = await checkout({
      addressId: selectedAddressId,
      paymentMethod: paymentMethod as PAYMENT_METHOD_ENUM,
      shops: selectedCartItems.map((cartItem) => ({
        shopId: cartItem.shop.id,
        note:
          noteValues.find((item) => item.shopId === cartItem.shop.id)?.note ??
          "",
        itemIds: cartItem.items.map((item) => item.id),
      })),
    });

    const isSuccess = data != null;

    if (isSuccess) {
      dispatch(clearItems());
      router.push(`${ROUTE.ORDER_CONFIRM}/${data.id}`);
    }

    notifications.show({
      message: isSuccess ? "Mua sản phẩm thành công!" : "Mua sản phẩm thất bại",
      ...getNotificationIcon(
        NOTIFICATION_TYPE[isSuccess ? "SUCCESS" : "FAILED"]
      ),
    });
    setLoading(false);
  };

  if (selectedItems.length === 0 || data?.shopItems.length === 0) {
    return (
      <div className="text-center mt-[20%]">
        <div className="flex justify-center">
          <IconSearchOff width={150} height={150} />
        </div>
        <div className="text-xl mt-4">
          Bạn vẫn chưa chọn sản phẩm nào để tiến hành thanh toán!
        </div>
        <div
          className="mt-2 cursor-pointer text-primary"
          onClick={() => router.push(ROUTE.CART)}
        >
          Ấn vào đây để quay lại giỏ hàng
        </div>
      </div>
    );
  }

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddressId: selectedAddressId,
        setSelectedAddressId: setSelectedAddressId,
      }}
    >
      <div className="checkout-page lg:flex gap-16">
        <div className="checkout-items flex-1">
          <div className="bg-white p-6">
            <CheckoutAddress />
          </div>
          <div className="mt-10">
            {selectedCartItems.map((cartSection, idx) => (
              <div key={idx}>
                <div className="bg-white mt-10 p-2 sm:p-6 rounded-sm relative">
                  <CartSectionComponent
                    isCartPage={false}
                    cartSection={cartSection}
                    dispatch={dispatch}
                    isChecked={isChecked}
                    revalidateFunc={mutate}
                  />
                </div>
                <div className="bg-white p-2 sm:p-6 mt-2">
                  Lời nhắn:{" "}
                  <TextInput
                    placeholder="Nhập lời nhắn cho shop"
                    onChange={(event) => {
                      const arr = noteValues.filter(
                        (value) => value.shopId !== cartSection.shop.id
                      );
                      arr.push({
                        shopId: cartSection.shop.id,
                        note: event.target.value,
                      });
                      setNoteValues(arr);
                    }}
                  />
                </div>
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
            <div>Subtotal {`(${flattedCheckoutItems.length} items)`}</div>
            <div>{`${totalPrice}  ${flattedCheckoutItems[0].price.unit}`}</div>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between">
            <div>Total</div>
            <div>{`${totalPrice}  ${flattedCheckoutItems[0].price.unit}`}</div>
          </div>
          <div className="flex justify-center mt-10 mb-4">
            <Button
              style={{ width: "80%", height: 45 }}
              className="bg-primary"
              onClick={paymentSubmit}
            >
              Proceed to payment
            </Button>
          </div>
        </div>
      </div>
    </CheckoutContext.Provider>
  );
}
