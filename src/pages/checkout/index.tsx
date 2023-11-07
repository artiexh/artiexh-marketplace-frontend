import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, TextInput } from "@mantine/core";
import CartSectionComponent from "@/components/CartSection/CartSection";
import vnpayImg from "../../../public/assets/vn_pay.svg";
import Image from "next/image";
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import { useEffect, useMemo, useState } from "react";
import axiosClient from "@/services/backend/axiosClient";
import { CartData, CartItem } from "@/services/backend/types/Cart";
import useSWR from "swr";
import { CartSection } from "@/services/backend/types/Cart";
import CheckoutAddress from "@/containers/CheckoutAddress";
import { checkout, getPaymentLink } from "@/services/backend/services/cart";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import {
  NOTIFICATION_TYPE,
  PAYMENT_METHOD,
  PAYMENT_METHOD_ENUM,
} from "@/constants/common";
import { clearItems } from "@/store/slices/cartSlice";
import { useRouter } from "next/router";
import { ROUTE } from "@/constants/route";
import { IconSearchOff } from "@tabler/icons-react";
import { getNotificationIcon } from "@/utils/mapper";
import { notifications } from "@mantine/notifications";
import { getShippingFee } from "@/services/backend/services/order";
import { isNumber } from "lodash";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { CommonResponseBase } from "@/types/ResponseBase";
import { SelectedItems } from "@/types/Cart";

const PAYMENT_ITEM = [
  {
    imgUrl: vnpayImg,
    title: "VNPay Wallet",
    key: "VN_PAY",
  },
];

function CheckoutPage() {
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
  const [shippingFee, setShippingFee] = useState<number | undefined>();

  const { data, mutate } = useSWR("cart", async () => {
    try {
      const result = await axiosClient.get<
        CommonResponseBase<{ campaigns: SelectedItems[] }>
      >("/cart");
      return result.data.data.campaigns ?? [];
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
    data?.forEach((shopItem) => {
      flattedItems.forEach((item) => {
        const selectedProducts: CartItem[] = [];
        shopItem.items.forEach((i) => {
          if (item.id === i.id) {
            selectedProducts.push(i);
          }
        });

        if (selectedProducts.length > 0) {
          const findItem = items.find(
            (item) => item.campaign.id === shopItem.campaign.id
          );

          if (findItem != null) {
            findItem.items.push(...selectedProducts);
          } else {
            items.push({
              campaign: shopItem.campaign,
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

  useEffect(() => {
    const getTotalShippingFee = async () => {
      const res = await getShippingFee({
        addressId: selectedAddressId,
        tags: [],
        totalWeight: 10,
      });

      setShippingFee(res);
    };
    getTotalShippingFee();
  }, [selectedAddressId, selectedCartItems]);

  const paymentSubmit = async () => {
    setLoading(true);
    console.log(shippingFee);
    const data = await checkout({
      addressId: selectedAddressId,
      paymentMethod: paymentMethod as PAYMENT_METHOD_ENUM,
      campaigns: selectedCartItems.map((cartItem) => ({
        campaignId: cartItem.campaign.id,
        note:
          noteValues.find((item) => item.shopId === cartItem.campaign.id)
            ?.note ?? "",
        itemIds: cartItem.items.map((item) => item.id),
        shippingFee: isNumber(shippingFee) ? shippingFee : 0,
      })),
    });
    const isSuccess = data != null;
    if (isSuccess) {
      if (data.paymentMethod === PAYMENT_METHOD.VN_PAY) {
        const paymentLink = await getPaymentLink(data.id);
        if (paymentLink) {
          window.location.replace(paymentLink);
        } else {
          notifications.show({
            message: "Không tìm thấy link thanh toán",
            ...getNotificationIcon(NOTIFICATION_TYPE.FAILED),
          });
        }
        return;
      } else {
        dispatch(clearItems());
        router.push(`${ROUTE.ORDER_CONFIRM}/${data.id}`);
      }
    }
    notifications.show({
      message: isSuccess ? "Mua sản phẩm thành công!" : "Mua sản phẩm thất bại",
      ...getNotificationIcon(
        NOTIFICATION_TYPE[isSuccess ? "SUCCESS" : "FAILED"]
      ),
    });
    setLoading(false);
  };

  if (
    selectedItems.length === 0 ||
    data?.length === 0 ||
    flattedCheckoutItems.length === 0
  ) {
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
                    revalidateFunc={mutate as any}
                  />
                </div>
                <div className="bg-white p-2 sm:p-6 mt-2">
                  Lời nhắn:{" "}
                  <TextInput
                    placeholder="Nhập lời nhắn cho shop"
                    onChange={(event) => {
                      const arr = noteValues.filter(
                        (value) => value.shopId !== cartSection.campaign.id
                      );
                      arr.push({
                        shopId: cartSection.campaign.id,
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
            <div>{`${totalPrice}  ${flattedCheckoutItems[0]?.price?.unit}`}</div>
          </div>
          <div className="flex justify-between">
            <div>Shipping fee: {`(${flattedCheckoutItems.length} items)`}</div>
            <div>{`${shippingFee}  ${flattedCheckoutItems[0]?.price?.unit}`}</div>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between">
            <div>Total</div>
            <div>{`${totalPrice + (isNumber(shippingFee) ? shippingFee : 0)}  ${
              flattedCheckoutItems[0]?.price?.unit
            }`}</div>
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

CheckoutPage.getLayout = function getLayout(page: any) {
  return <Wrapper>{page}</Wrapper>;
};

function Wrapper({ children }: { children: any }) {
  const router = useRouter();
  return <AuthWrapper router={router}>{children}</AuthWrapper>;
}

export default CheckoutPage;
