import { CheckoutBody } from "@/types/Cart";
import axiosClient from "../axiosClient";
import { CartData } from "../types/Cart";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Order, TotalOrder } from "@/types/Order";
import { updateUserInformation } from "@/utils/user";

export const updateCartItem = async (productId: string, quantity: number) => {
  let cartItems;
  try {
    const { data: result } = await axiosClient.put<CartData>("/cart/item", {
      items: [
        {
          productId,
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

export const deleteCartItem = async (productId: string[]) => {
  let cartItems;
  try {
    const { data: result } = await axiosClient.delete<CartData>("/cart/item", {
      data: {
        productIds: productId,
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
        `order/${id}/payment`
      )
    ).data;

    return data.paymentUrl;
  } catch (err) {
    console.log(err);
    return "";
  }
};
