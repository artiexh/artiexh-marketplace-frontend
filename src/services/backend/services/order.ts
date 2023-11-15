import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import { ArtistOrderDetail, UpdateShippingBody } from "@/types/Order";

export type ShippingFeeBody = {
  addressId: string;
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

export const updateShippingInformation = async (id: string) => {
  try {
    const result = await axiosClient.put<CommonResponseBase<ArtistOrderDetail>>(
      `/artist/order-shop/${id}/shipping`,
      {}
    );
    return result.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const cancelOrderApi = async (id: string) =>
  axiosClient.patch(`/order/${id}/status`, {
    message: "User cancel order",
    status: "CANCELED",
  });
