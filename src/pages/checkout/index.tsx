import CartSectionComponent from "@/components/CartSection/CartSection";
import LogoCheckbox from "@/components/LogoCheckbox/LogoCheckbox";
import { PAYMENT_METHOD_ENUM } from "@/constants/common";
import { ROUTE } from "@/constants/route";
import CheckoutAddress from "@/containers/CheckoutAddress";
import { CheckoutContext } from "@/contexts/CheckoutContext";
import axiosClient from "@/services/backend/axiosClient";
import { checkout, getPaymentLink } from "@/services/backend/services/cart";
import { getShippingFee } from "@/services/backend/services/order";
import { CartItem, CartSection } from "@/services/backend/types/Cart";
import AuthWrapper from "@/services/guards/AuthWrapper";
import { SelectedItems } from "@/types/Cart";
import { CommonResponseBase } from "@/types/ResponseBase";
import { errorHandler } from "@/utils/errorHandler";
import { currencyFormatter, productInSaleIdFormatter } from "@/utils/formatter";
import { Button, Divider, LoadingOverlay, TextInput } from "@mantine/core";
import { IconSearchOff } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import vnpayImg from "../../../public/assets/vn_pay.svg";

const PAYMENT_ITEM = [
  {
    imgUrl: vnpayImg,
    title: "VNPay Wallet",
    key: "VN_PAY",
  },
];

function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VN_PAY");
  const [noteValues, setNoteValues] = useState<
    {
      shopId: string;
      note: string;
    }[]
  >([]);

  const {
    data,
    mutate,
    isLoading: isCartLoading,
  } = useSWR("cart", async () => {
    try {
      const result = await axiosClient.get<
        CommonResponseBase<{ campaigns: SelectedItems[] }>
      >("/cart");
      return result.data.data.campaigns ?? [];
    } catch (e) {
      return null;
    }
  });

  const finalizeQuery = (
    typeof router.query.itemId === "string"
      ? [router.query.itemId]
      : typeof router.query.itemId === "undefined"
      ? []
      : router.query.itemId
  ).reduce((prev, cur) => {
    const [campaignId, productCode] = cur.split("_");
    if (prev[campaignId]) {
      prev[campaignId].push(productCode);
    } else {
      prev[campaignId] = [productCode];
    }

    return prev;
  }, {} as Record<string, string[]>);

  const selectedItems: CartSection[] =
    data
      ?.filter((i) => finalizeQuery[i.saleCampaign.id])
      .map((el) => {
        return {
          saleCampaign: el.saleCampaign,
          items: el.items.filter((i) =>
            finalizeQuery[el.saleCampaign.id]?.includes(i.productCode)
          ),
        };
      }) ?? [];

  const flattedItems = selectedItems
    .map((item) =>
      item.items.map((el) => ({
        ...el,
        id: productInSaleIdFormatter(item.saleCampaign.id, el.productCode),
      }))
    )
    .flat();

  const isChecked = (saleCampaignId: string, productCode: string) => {
    return flattedItems.some(
      (cartItem) =>
        cartItem.id === productInSaleIdFormatter(saleCampaignId, productCode)
    );
  };

  // the actual calculated selected data from api
  const selectedCartItems = useMemo(() => {
    const items: CartSection[] = [];
    // list cart item
    data?.forEach((shopItem) => {
      flattedItems.forEach((item) => {
        const selectedProducts: CartItem[] = [];
        shopItem.items.forEach((i) => {
          const [campaignId, productCode] = item.id.split("_");
          if (
            productCode === i.productCode &&
            campaignId === shopItem.saleCampaign.id
          ) {
            selectedProducts.push(i);
          }
        });

        if (selectedProducts.length > 0) {
          const findItem = items.find(
            (item) => item.saleCampaign.id === shopItem.saleCampaign.id
          );

          if (findItem != null) {
            findItem.items.push(...selectedProducts);
          } else {
            items.push({
              saleCampaign: shopItem.saleCampaign,
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

  const { data: shippingFees, isLoading: isShippingLoading } = useQuery({
    queryKey: ["shipping-fee", selectedAddressId, selectedCartItems],
    queryFn: async () => {
      if (!selectedAddressId || selectedCartItems.length === 0) return null;

      const res = await Promise.all(
        selectedCartItems.map((item) =>
          getShippingFee({
            addressId: selectedAddressId,
            tags: [],
            totalWeight: 10,
          })
        )
      );

      return res.map((item, index) => ({
        campaignId: selectedCartItems[index].saleCampaign.id,
        shippingFee: item,
      }));
    },
  });

  const paymentSubmitMutation = useMutation({
    mutationFn: async () => {
      const data = await checkout({
        addressId: selectedAddressId,
        paymentMethod: paymentMethod as PAYMENT_METHOD_ENUM,
        campaigns: selectedCartItems.map((cartItem) => {
          const shippingFee = shippingFees?.find(
            (el) => el.campaignId === cartItem.saleCampaign.id
          );
          if (!shippingFee?.shippingFee)
            throw new Error("Có lỗi xảy ra, mua sản phẩm thất bại");
          return {
            campaignId: cartItem.saleCampaign.id,
            note:
              noteValues.find(
                (item) => item.shopId === cartItem.saleCampaign.id
              )?.note ?? "",
            itemIds: cartItem.items.map((item) => item.productCode),
            shippingFee: isNumber(shippingFee.shippingFee)
              ? shippingFee.shippingFee
              : 0,
          };
        }),
      });

      if (!data) throw new Error("Có lỗi xảy ra, mua sản phẩm thất bại");

      const paymentLink = await getPaymentLink(data.id);

      if (!paymentLink)
        throw new Error("Có lỗi xảy ra, Không tìm thấy link thanh toán");

      window.location.replace(paymentLink);

      return paymentLink;
    },
    onSuccess: (data) => {
      window.location.replace(data);
    },
    onError: (e) => {
      errorHandler(e);
    },
  });

  const loadingVisibility = isShippingLoading || isCartLoading;

  if (
    !loadingVisibility &&
    (selectedItems.length === 0 ||
      data?.length === 0 ||
      flattedCheckoutItems.length === 0)
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
      <LoadingOverlay visible={loadingVisibility} zIndex={1000} />
      <div className="checkout-page lg:flex gap-y-16 gap-x-4 relative">
        <div className="checkout-items flex-1">
          <div className="bg-white p-6">
            <CheckoutAddress />
          </div>
          <div className="mt-10">
            {selectedCartItems.map((cartSection, idx) => {
              const subtotal = cartSection.items.reduce(
                (acc, cartItem) =>
                  acc + cartItem.price.amount * cartItem.quantity,
                0
              );
              const shippingFee = shippingFees?.find(
                (el) => el.campaignId === cartSection.saleCampaign.id
              );
              return (
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
                  <div className="bg-white mt-2 p-2 sm:p-6 rounded-sm relative">
                    <div className="flex justify-between">
                      <div>
                        Phí vận chuyển: {`(${cartSection.items.length} món)`}
                      </div>
                      <div>{`${
                        typeof shippingFee?.shippingFee === "number"
                          ? currencyFormatter(shippingFee.shippingFee)
                          : "N/A"
                      }`}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        Tổng tiền {`(${cartSection.items.length} items)`}
                      </div>
                      <div>{`${currencyFormatter(
                        subtotal + (shippingFee?.shippingFee ?? 0)
                      )}`}</div>
                    </div>
                  </div>
                  <div className="bg-white p-2 sm:p-6 mt-2">
                    Lời nhắn:{" "}
                    <TextInput
                      placeholder="Nhập lời nhắn cho shop"
                      onChange={(event) => {
                        const arr = noteValues.filter(
                          (value) =>
                            value.shopId !== cartSection.saleCampaign.id
                        );
                        arr.push({
                          shopId: cartSection.saleCampaign.id,
                          note: event.target.value,
                        });
                        setNoteValues(arr);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="payment-sections bg-white p-6 lg:w-[30vw] mt-10 md:mt-0 sticky top-28"
          style={{ height: "fit-content" }}
        >
          <div className="text-2xl font-bold mb-8">Chọn phương thức</div>
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
          <div className="text-2xl font-bold mt-10 mb-4">Đơn hàng</div>
          <div className="flex justify-between">
            <div>
              Tổng tiền sản phẩm {`(${flattedCheckoutItems.length} món)`}
            </div>
            <div>{`${currencyFormatter(totalPrice)}`}</div>
          </div>
          <div className="flex justify-between">
            <div>Tổng phí ship: {`(${flattedCheckoutItems.length} món)`}</div>
            <div>{`${
              shippingFees?.every((el) => typeof el.shippingFee === "number")
                ? currencyFormatter(
                    shippingFees.reduce(
                      (acc, item) => acc + (item.shippingFee as number),
                      0
                    )
                  )
                : "N/A"
            }`}</div>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between">
            <div>Tổng tiền</div>
            <div>{`${currencyFormatter(
              totalPrice +
                (shippingFees?.every((el) => typeof el.shippingFee === "number")
                  ? shippingFees.reduce(
                      (acc, item) => acc + (item.shippingFee as number),
                      0
                    )
                  : 0) *
                  selectedCartItems.length
            )}`}</div>
          </div>
          <div className="flex justify-center mt-10 mb-4">
            <Button
              disabled={
                isShippingLoading ||
                shippingFees?.some((el) => typeof el.shippingFee !== "number")
              }
              loading={paymentSubmitMutation.isLoading}
              style={{ width: "80%", height: 45 }}
              className="bg-primary !text-white"
              onClick={() => paymentSubmitMutation.mutate()}
            >
              Tiến hành thanh toán
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
