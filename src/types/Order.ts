import { PAYMENT_METHOD_ENUM } from "@/constants/common";
import { UserAddress } from "./User";

export type Order = {
  createdDate: string;
  id: string;
  modifiedDate: string;
  note: string;
  paymentMethod: PAYMENT_METHOD_ENUM;
  shippingAddress: UserAddress;
  shop: {
    id: string;
    shopImageUrl: string;
    shopName: string;
  };
};
