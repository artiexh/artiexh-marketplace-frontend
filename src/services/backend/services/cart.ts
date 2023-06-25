import axiosClient from "../axiosClient";

export const addToCart = async (productId: string, quantity: number) => {
  const result = await axiosClient.put("/cart/item", {
    items: [
      {
        productId: 456149873649872516,
        quantity,
      },
    ],
  });

  return result;
};
