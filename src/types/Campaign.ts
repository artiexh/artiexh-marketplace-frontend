import { SimpleDesignItem } from "./DesignItem";
import { Price } from "./Product";
import { ProductBaseDetail } from "./ProductBase";
import { Provider } from "./User";

export type Campaign = {
  id: string;
  thumb: string;
  name: string;
  total: Price;
  payment?: string;
  status: string;
};

export type ArtistCampaignColumnType = Pick<
  Campaign,
  "id" | "name" | "payment" | "status" | "thumb" | "total"
>;

export type CampaignData = {
  id: string;
  status: string;
  thumbnailUrl: string;
  owner: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  name: string;
  description: string;
  type: string;
  isPublished: boolean;
  from: string;
  to: string;
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

// New campaign detail type

export type CampaignDetailResponse = CampaignData & {
  provider: Provider;
  content: string;
};

// Old type
export type CampaignDetail = {
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
