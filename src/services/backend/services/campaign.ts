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

export const ARTIST_CAMPAIGN_ENDPOINT = "/artist-campaign";

export const createCampaignApi = (body: {
  name: string;
  type: "PRIVATE" | "SHARE";
}) =>
  axiosClient.post<CommonResponseBase<CampaignDetail>>(
    ARTIST_CAMPAIGN_ENDPOINT,
    {
      ...body,
    }
  );

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
    `${ARTIST_CAMPAIGN_ENDPOINT}/provider?${params.toString()}`
  );
};

export const updateCampaignStatusApi = (
  id: string,
  body: {
    message: string;
    status: string;
  }
) =>
  axiosClient.patch(`${ARTIST_CAMPAIGN_ENDPOINT}/${id}/status`, {
    ...body,
  });

export const updateCampaignGeneralInfoApi = (
  campaign: CampaignDetail,
  generalInfo: {
    name: string;
    description?: string;
    type: "SHARE" | "PRIVATE";
    from?: string;
    to?: string;
  }
) =>
  axiosClient.put(`${ARTIST_CAMPAIGN_ENDPOINT}/${campaign.id}`, {
    name: generalInfo.name,
    description: generalInfo.description,
    type: generalInfo.type,
    providerId: campaign?.provider?.businessCode,
    from: generalInfo.from,
    to: generalInfo.to,
    content: campaign.content,
    thumbnailUrl: campaign.thumbnailUrl,
    products:
      campaign?.products?.map((prod) => {
        return {
          customProductId: prod.customProduct.id,
          price: prod.price,
          quantity: prod.quantity,
        };
      }) ?? [],
  });

export const updateCampaignWebInfoApi = (
  campaign: CampaignDetail,
  webData: {
    content?: string;
    thumbnailUrl?: string;
  }
) =>
  axiosClient.put(`${ARTIST_CAMPAIGN_ENDPOINT}/${campaign.id}`, {
    name: campaign.name,
    description: campaign.description,
    type: campaign.type,
    providerId: campaign?.provider?.businessCode,
    from: campaign.from,
    to: campaign.to,
    content: webData.content,
    thumbnailUrl: webData.thumbnailUrl,
    products:
      campaign?.products?.map((prod) => {
        return {
          customProductId: prod.customProduct.id,
          price: prod.price,
          quantity: prod.quantity,
        };
      }) ?? [],
  });

export const updateCampaignCustomProductsApi = (
  campaign: CampaignDetail,
  customProducts: Partial<Pick<CustomProduct, "price" | "quantity">> &
    {
      customProductId: string;
    }[],
  providerId: string
) =>
  axiosClient.put(`${ARTIST_CAMPAIGN_ENDPOINT}/${campaign.id}`, {
    name: campaign.name,
    type: campaign.type,
    description: campaign.description,
    products: customProducts,
    providerId: providerId,
    from: campaign.from,
    to: campaign.to,
    content: campaign.content,
    thumbnailUrl: campaign.thumbnailUrl,
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
