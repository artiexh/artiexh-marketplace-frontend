import { PAYMENT_METHOD_ENUM } from "@/constants/common";
import { CartItem } from "@/services/backend/types/Cart";

export type SelectedItems = {
  artistId: string;
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
