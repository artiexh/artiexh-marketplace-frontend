import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";

type CustomProductBody = {
  inventoryItemId: string;
};

export type CamapignDetail = {
  campaignHistories: [
    {
      action: string;
      eventTime: string;
      message: string;
    }
  ];
  customProducts: {
    attaches: {
      description: string;
      id: string;
      title: string;
      type: string;
      url: string;
    }[];
    category: {
      id: string;
      imageUrl: string;
      name: string;
    };
    createdDate: string;
    description: string;
    id: string;
    limitPerOrder: string;
    modifiedDate: string;
    name: string;
    price: {
      amount: string;
      unit: string;
    };
    quantity: string;
    tags: string[];
  }[];
  id: string;
  owner: {
    avatarUrl: string;
    displayName: string;
    id: string;
    province: {
      country: {
        id: string;
        name: string;
        provinces: string[];
      };
      districts: {
        fullName: string;
        id: string;
        name: string;
        province: string;
        wards: {
          district: string;
          fullName: string;
          id: string;
          name: string;
        }[];
      }[];
      fullName: string;
      id: string;
      name: string;
    };
    username: string;
  };
  status: "CANCELED";
};

export const createCampaignApi = (body: {
  customProducts: CustomProductBody[];
  providerId: string;
}) =>
  axiosClient.post<CommonResponseBase<CamapignDetail>>("/campaign", {
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

export const updateCampaignStatusApi = (
  id: string,
  body: {
    message: string;
    status: string;
  }
) =>
  axiosClient.patch(`/campaign/${id}/status`, {
    ...body,
  });
