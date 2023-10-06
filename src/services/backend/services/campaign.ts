import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";

type CustomProductBody = {
  inventoryItemId: string;
};

export const createCampaignApi = (body: {
  customProducts: CustomProductBody[];
  providerId: string;
}) =>
  axiosClient.post("/campaign", {
    ...body,
  });

export type ProviderConfigByDesignItem = {
  address: string;
  businessCode: string;
  businessName: string;
  contactName: string;
  description: string;
  designItems: [
    {
      config: {
        basePriceAmount: number;
        manufacturingTime: string;
        minQuantity: number;
        provider: {
          address: string;
          businessCode: string;
          businessName: string;
          categories: [
            {
              id: number;
              imageUrl: string;
              name: string;
            }
          ];
          contactName: string;
          email: string;
          imageUrl: string;
          phone: string;
        };
      };
      id: number;
      name: string;
    }
  ];
  email: string;
  imageUrl: string;
  phone: string;
  website: string;
};

export const calculateDesignItemConfig = (ids: string[]) => {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("inventoryItemIds", id));
  return axiosClient.get<CommonResponseBase<ProviderConfigByDesignItem[]>>(
    `/campaign/provider?${params.toString()}`
  );
};
