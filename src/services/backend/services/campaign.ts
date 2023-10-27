import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import { DesignItemDetail, SimpleDesignItem } from "@/types/DesignItem";
import { ProductBaseDetail } from "@/types/ProductBase";

type CustomProductBody = {
  inventoryItemId: string;
};

export type CustomProduct = {
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
  providerConfig: {
    basePriceAmount: number;
    manufacturingTime: string;
    minQuantity: number;
  };
  inventoryItem: Omit<SimpleDesignItem, "variant"> & {
    productBase: Pick<ProductBaseDetail, "id" | "name" | "imageCombinations">;
    variant: {
      id: string;
      variantCombination: {
        optionName: string;
        valueName: string;
        value: string;
      }[];
    };
  };
};

export type CamapignDetail = {
  name: string;
  description?: string;
  campaignHistories: {
    action: string;
    eventTime: string;
    message: string;
    updatedBy: string;
  }[];
  providerId: string;
  customProducts: CustomProduct[];
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
  provider: {
    address: string;
    businessCode: string;
    businessName: string;
    categories: string[];
    contactName: string;
    email: string;
    imageUrl: string;
    phone: string;
  };
  status: string;
  thumbnailUrl?: string;
  type: "SHARE" | "PRIVATE";
  content?: string;
};

export const createCampaignApi = (body: {
  name: string;
  type: "PRIVATE" | "SHARE";
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

export const updateCampaignGeneralInfoApi = (
  campaign: CamapignDetail,
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
  campaign: CamapignDetail,
  customProducts: Pick<
    CustomProduct,
    | "attaches"
    | "description"
    | "limitPerOrder"
    | "name"
    | "price"
    | "quantity"
    | "tags"
  > & {
    inventoryItemId: string;
  }
) =>
  axiosClient.put(`/campaign/${campaign.id}`, {
    name: campaign.name,
    type: campaign.type,
    description: campaign.description,
    providerId: campaign?.provider?.businessCode,
    customProducts: customProducts,
  });

export const updateCampaignProviderApi = (
  campaign: CamapignDetail,
  providerId: string
) =>
  axiosClient.put(`/campaign/${campaign.id}`, {
    name: campaign.name,
    type: campaign.type,
    description: campaign.description,
    providerId: providerId,
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
