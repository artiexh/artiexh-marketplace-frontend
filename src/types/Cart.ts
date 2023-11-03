import { PAYMENT_METHOD_ENUM } from "@/constants/common";
import { CartItem } from "@/services/backend/types/Cart";
import { CampaignData } from "./Campaign";

export type SelectedItems = {
  campaign: CampaignData;
  items: CartItem[];
};

export type CheckoutBody = {
  addressId: string;
  paymentMethod: PAYMENT_METHOD_ENUM;
  shops: {
    shopId: string;
    note: string;
    itemIds: string[];
  }[];
};
