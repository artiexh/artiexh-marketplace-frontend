import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import {
  CampaignData,
  CampaignDetail,
  CampaignDetailResponse,
  CustomProduct,
} from "@/types/Campaign";
import { Product } from "@/types/Product";

type CustomProductBody = {
  inventoryItemId: string;
};

export const createCampaignApi = (body: {
  name: string;
  type: "PRIVATE" | "SHARE";
}) =>
  axiosClient.post<CommonResponseBase<CampaignDetail>>("/campaign", {
    ...body,
  });

export type ProviderConfigByDesignItem = {
  address: string;
  businessCode: string;
  businessName: string;
  contactName: string;
  description: string;
  customProducts: [
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
  ids.forEach((id) => params.append("customProductIds", id));
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

export const updateCampaignGeneralInfoApi = (
  campaign: CampaignDetail,
  generalInfo: {
    name: string;
    description?: string;
    type: "SHARE" | "PRIVATE";
  }
) =>
  axiosClient.put(`/campaign/${campaign.id}`, {
    name: generalInfo.name,
    description: generalInfo.description,
    type: generalInfo.type,
    providerId: campaign?.provider?.businessCode,
    customProducts:
      campaign?.customProducts?.map((prod) => {
        return {
          attaches: prod.attaches,
          description: prod.description,
          inventoryItemId: prod.inventoryItem.id,
          limitPerOrder: prod.limitPerOrder,
          name: prod.name,
          price: prod.price,
          quantity: prod.quantity,
          tags: prod.tags,
        };
      }) ?? [],
  });

export const updateCampaignCustomProductsApi = (
  campaign: CampaignDetail,
  customProducts: Pick<CustomProduct, "price" | "quantity"> & {
    customProductId: string;
  }
) =>
  axiosClient.put(`/campaign/${campaign.id}`, {
    name: campaign.name,
    type: campaign.type,
    description: campaign.description,
    providerId: campaign?.provider?.businessCode,
    products: customProducts,
  });

export const updateCampaignProviderApi = (
  campaign: CampaignDetail,
  providerId: string
) =>
  axiosClient.put(`/campaign/${campaign.id}`, {
    name: campaign.name,
    type: campaign.type,
    description: campaign.description,
    providerId: providerId,
    products:
      campaign?.products?.map((prod) => {
        return {
          price: prod.price,
          quantity: prod.quantity,
          customProductId: prod.id,
        };
      }) ?? [],
  });

export const getMarketplaceCampaignById = async (id: string) => {
  try {
    const result = await axiosClient.get<
      CommonResponseBase<CampaignDetailResponse>
    >(`/marketplace/campaign/${id}`);

    return result.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getMarketplaceCampaignProductsById = async (id: string) => {
  try {
    const result = await axiosClient.get<CommonResponseBase<Product>>(
      `/marketplace/campaign/${id}/product`
    );

    return result.data.data;
  } catch (err) {
    console.log(err);
  }
};
