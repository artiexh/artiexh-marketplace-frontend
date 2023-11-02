import { SimpleCustomProduct } from "./CustomProduct";
import { Price } from "./Product";
import { ProductBaseDetail } from "./ProductBase";
import { Provider } from "./User";
import { Attaches } from "./common";

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
  createdDate: string;
  customProduct: {
    attaches: Attaches[];
    campaignLock: string;
    category: {
      id: string;
      imageUrl: string;
      name: string;
    };
    createdDate: string;
    description: string;
    id: string;
    maxItemPerOrder: number;
    modelThumbnail: {
      fileName: string;
      id: string;
      name: string;
    };
    modifiedDate: string;
    name: string;
    tags: string[];
    variant: {
      id: string;
      productTemplate: {
        id: string;
        name: string;
      };
      variantCombinations: {
        option: {
          id: string;
          name: string;
        };
        optionValue: {
          id: string;
          name: string;
          value: string;
        };
      }[];
    };
  };
  id: string;
  modifiedDate: string;
  price: {
    amount: number;
    unit: string;
  };
  providerConfig: {
    basePriceAmount: number;
    manufacturingTime: string;
    minQuantity: number;
  };
  quantity: number;
};

// New campaign detail type

export type CampaignDetailResponse = CampaignData & {
  provider: Provider;
  content: string;
};

export type CampaignHistory = {
  action: string;
  eventTime: string;
  message: string;
  updatedBy: string;
};

// Old type
export type CampaignDetail = {
  campaignHistories: CampaignHistory[];
  content: string;
  description: string;
  from: string;
  id: 0;
  isPublished: true;
  name: string;
  owner: {
    avatarUrl: string;
    displayName: string;
    id: string;
    username: string;
  };
  products: CustomProduct[];
  provider: {
    address: string;
    businessCode: string;
    businessName: string;
    categories: {
      id: string;
      imageUrl: string;
      name: string;
    }[];
    contactName: string;
    email: string;
    imageUrl: string;
    phone: string;
  };
  status: string;
  thumbnailUrl: string;
  to: string;
  type: "SHARE" | "PRIVATE";
};
