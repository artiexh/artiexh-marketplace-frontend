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
  createdBy: string;
  createdDate: string;
  description: string;
  from: string;
  id: string;
  modifiedDate: string;
  name: string;
  owner: {
    avatarUrl: string;
    displayName: string;
    id: string;
    province: {
      country: {
        id: string;
        name: string;
      };
      id: string;
      name: string;
    };
    username: string;
  };
  publicDate: string;
  thumbnailUrl: string;
  to: string;
  type: "SHARE" | "PUBLIC" | "PRIVATE";
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
  action?: string;
  eventTime?: string;
  message?: string;
  updatedBy?: string;
};

// Old type
export type CampaignDetail = {
  campaignHistories: CampaignHistory[];
  content: string;
  description: string;
  from: string;
  id: string;
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

export type ProductInCampaignDetail = {
  createdDate: string;
  customProduct: {
    attaches: Attaches[];
    campaignLock: string;
    category: {
      id: string;
      imageUrl: string;
      name: string;
    };
    combinationCode: string;
    createdDate: string;
    description: string;
    id: string;
    imageSet: {
      id: string;
      manufacturingImage: {
        fileName: string;
        id: string;
        name: string;
      };
      mockupImage: {
        fileName: string;
        id: string;
        name: string;
      };
      positionCode: string;
    }[];
    maxItemPerOrder: string;
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
        code: string;
        id: string;
        imageCombinations: {
          code: string;
          images: {
            code: string;
            name: string;
            position: [number, number, number];
            rotate: [number, number, number];
            scale: [number, number, number];
            size: {
              height: number;
              width: number;
            };
          }[];
          name: string;
        }[];
        model3DCode: string;
        modelFileId: string;
        name: string;
        sizes: {
          key: string;
          label: string;
          number: number;
          unit: string;
        }[];
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
  id: 0;
  modifiedDate: string;
  price: {
    amount: 0;
    unit: string;
  };
  providerConfig: {
    basePriceAmount: 0;
    manufacturingTime: string;
    minQuantity: 0;
  };
  quantity: 0;
};
