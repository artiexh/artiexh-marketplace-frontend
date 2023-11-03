import { CampaignData } from "@/types/Campaign";

export type CartItem = {
  id: string;
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
};

export type CartSection = {
  campaign: CampaignData;
  items: CartItem[];
};

export type CartData = {
  shopItems: CartSection[];
};
