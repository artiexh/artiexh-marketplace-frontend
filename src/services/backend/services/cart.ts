import { CheckoutBody } from "@/types/Cart";
import axiosClient from "../axiosClient";
import { CartData } from "../types/Cart";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Order, TotalOrder } from "@/types/Order";
import { updateUserInformation } from "@/utils/user";

export const updateCartItem = async (
  productCode: string,
  saleCampaignId: string,
  quantity: number
) => {
  let cartItems;
  try {
    const { data: result } = await axiosClient.put<CartData>("/cart/item", {
      items: [
        {
          productCode,
          saleCampaignId,
          quantity,
        },
      ],
    });

    cartItems = result;
    await updateUserInformation();
  } catch (err) {
    console.log(err);
  }

  return cartItems;
};

export const deleteCartItem = async (
  products: { productCode: string; saleCampaignId: string }[]
) => {
  let cartItems;
  try {
    const { data: result } = await axiosClient.delete<CartData>("/cart/item", {
      data: {
        items: products,
      },
    });
    cartItems = result;
    await updateUserInformation();
  } catch (err) {
    console.log(err);
  }

  return cartItems;
};

export const checkout = async (values: CheckoutBody) => {
  try {
    const { data } = (
      await axiosClient.post<CommonResponseBase<TotalOrder>>(
        "/order/checkout",
        values
      )
    ).data;

    await updateUserInformation();

    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const getPaymentLink = async (id: string) => {
  try {
    const { data } = (
      await axiosClient.get<CommonResponseBase<{ paymentUrl: string }>>(
        `order/${id}/payment?confirmUrl=${window.location.origin}/checkout/confirm`
      )
    ).data;

    return data.paymentUrl;
  } catch (err) {
    console.log(err);
    return "";
  }
};
