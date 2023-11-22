import { Attaches } from "./common";

export type SaleCampaignDetail = {
  campaignRequestId: string;
  content: string;
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
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  thumbnailUrl: string;
  to: string;
  type: "SHARE" | "PUBLIC" | "PRIVATE";
};

export type ProductInSale = {
  attaches: Attaches[];
  averageRate: number;
  category: {
    id: string;
    name: string;
  };
  deliveryType: string;
  description: string;
  inventoryPrice: {
    amount: string;
    unit: string;
  };
  inventoryQuantity: number;
  maxItemsPerOrder: number;
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
  paymentMethods: string[];
  price: {
    amount: number;
    unit: string;
  };
  productCode: string;
  quantity: number;
  soldQuantity: number;
  status: string;
  tags: string[];
  thumbnailUrl: string;
  type: string;
  weight: number;
  artistProfit: number;
};
