import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import { SimpleDesignItem } from "@/types/DesignItem";

export const createDesignItemApi = (body: {
  variantId: string;
  name: string;
}) =>
  axiosClient.post<CommonResponseBase<SimpleDesignItem>>("/inventory-item", {
    ...body,
  });
