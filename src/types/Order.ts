import {
  DELIVERY_TYPE_ENUM,
  ORDER_HISTORY_STATUS_ENUM,
  ORDER_STATUS_ENUM,
  PAYMENT_METHOD_ENUM,
} from "@/constants/common";
import { Address, User, Ward } from "./User";

type OrderTransaction = {
  id: string;
  transactionNo: string;
  orderId: string;
  priceAmount: number;
  bankCode: string;
  cardType: string;
  orderInfo: string;
  payDate: string;
  responseCode: string;
  message: string;
  transactionStatus: string;
};

type OrderItemDetail = {
  id: string;
  status: string;
  name: string;
  thumbnailUrl: string;
  price: {
    amount: number;
    unit: string;
  };
  description: string;
  type: string;
  remainingQuantity: number;
  publishDatetime: string;
  deliveryType: DELIVERY_TYPE_ENUM;
  quantity: number;
};

export type Order = {
  campaignSale: {
    createdBy: {
      avatarUrl: string;
      displayName: string;
      id: string;
      username: string;
    };
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
    status: string;
    thumbnailUrl: string;
    to: string;
    type: "SHARE" | "PUBLIC" | "PRIVATE";
  };
  createdDate: string;
  currentTransaction: OrderTransaction;
  id: string;
  modifiedDate: string;
  note: string;
  orderDetails: OrderItemDetail[];
  orderHistories: {
    datetime: string;
    message: string;
    status: string;
  }[];
  orderId: string;
  shippingFee: number;
  shippingLabel: string;
  status: string;
};

export type TotalOrder = {
  id: string;
  campaignOrders: Order[];
  paymentMethod: PAYMENT_METHOD_ENUM;
  currentTransaction?: OrderTransaction;
  deliveryAddress: string;
  deliveryCountry: string;
  deliveryDistrict: string;
  deliveryEmail: string;
  deliveryName: string;
  deliveryProvince: string;
  deliveryTel: string;
  deliveryWard: string;
};

export type ArtistOrder = {
  id: string;
  user: User;
  shippingAddress: Address;
  note: string;
  paymentMethod: PAYMENT_METHOD_ENUM;
  status: string;
  modifiedDate: string;
  createdDate: string;
  shippingFee: number;
};

export type ArtistOrderDetail = ArtistOrder & {
  orderDetails: OrderItemDetail[];
  orderHistories: {
    status: ORDER_HISTORY_STATUS_ENUM;
    datetime: string;
  }[];
};

export type ArtistOrderColumnType = ArtistOrder;

export type UpdateShippingBody = {
  // pickAddress: string;
  // pickDistrict: string;
  // pickWard: string;
  // pickProvince: string;
  // pickTel: string;
  // pickName: string;
  // returnAddress: string;
  // returnDistrict: string;
  // returnTel: string;
  // returnName: string;
  value: number;
};
