import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";

export type ShippingFeeBody = {
  addressId: string;
  shopId: string;
  tags?: string[];
  totalWeight: number;
};

export const getShippingFee = async (data: ShippingFeeBody) => {
  try {
    const result = await axiosClient.get<
      CommonResponseBase<{ name: string; fee: number; insurance_fee: number }>
    >("/order/shipping-fee", {
      params: data,
    });
    return result.data.data.fee;
  } catch (err) {
    console.log(err);
  }
};
