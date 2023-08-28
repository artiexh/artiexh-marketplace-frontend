import { CreateProductValues, Product } from "@/types/Product";
import axiosClient from "../axiosClient";

export const createProduct = async (data: CreateProductValues) => {
  try {
    const result = await axiosClient.post<Product>("/product", data);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
