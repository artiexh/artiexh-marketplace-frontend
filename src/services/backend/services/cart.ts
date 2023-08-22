import axiosClient from "../axiosClient";
import { CartData } from "../types/Cart";

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
  } catch (err) {
    console.log(err);
  }

  return cartItems;
};
