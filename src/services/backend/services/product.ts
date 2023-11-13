import { CreateProductBodyValues, Product } from "@/types/Product";
import axiosClient from "../axiosClient";
import { CommonResponseBase } from "@/types/ResponseBase";

export const createProduct = async (data: CreateProductBodyValues) => {
  try {
    const result = await axiosClient.post<CommonResponseBase<Product>>(
      "/product",
      data
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const updateProductInventory = async (
  data: any,
  productCode: string
) => {
  try {
    const result = await axiosClient.put(`/product-inventory/${productCode}`);

    return result;
  } catch (err) {
    console.log(err);
  }
};
