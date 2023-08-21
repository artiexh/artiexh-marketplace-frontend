import axiosClient from "../axiosClient";

export const addToCart = async (productId: string, quantity: number) => {
  const result = await axiosClient.put("/cart/item", {
    items: [
      {
        //TODO: will replace later after api is fixed
        productId: 456149873649872516,
        quantity,
      },
    ],
  });

  return result;
};
