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
