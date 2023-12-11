import { CampaignData } from "@/types/Campaign";

export type CartItem = {
  status: string;
  name: string;
  price: {
    amount: number;
    unit: string;
  };
  description: string;
  type: string;
  remainingQuantity: number;
  publishDatetime: string;
  deliveryType: string;
  quantity: number;
  thumbnailUrl: string;
  weight: number;
  maxItemsPerOrder: number;
  productCode: string;
};

export type CartSection = {
  saleCampaign: CampaignData;
  items: CartItem[];
};

export type CartData = {
  shopItems: CartSection[];
};
