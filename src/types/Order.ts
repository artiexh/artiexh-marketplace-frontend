import {
  DELIVERY_TYPE_ENUM,
  ORDER_HISTORY_STATUS_ENUM,
  ORDER_STATUS_ENUM,
  PAYMENT_METHOD_ENUM,
} from "@/constants/common";
import { Address, Ward } from "./User";

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
  id: string;
  shop: {
    id: string;
    shopImageUrl: string;
    shopName: string;
    shopWard: Ward;
  };
  note: string;
  status: ORDER_STATUS_ENUM;
  modifiedDate: string;
  createdDate: string;
  orderDetails: OrderItemDetail[];
  shippingFee: number;
  orderHistories: {
    status: ORDER_HISTORY_STATUS_ENUM;
    datetime: string;
  }[];
};

export type TotalOrder = {
  id: string;
  orders: Order[];
  shippingAddress: Address;
  paymentMethod: PAYMENT_METHOD_ENUM;
  currentTransaction?: OrderTransaction;
};

export type ArtistOrder = {};

export type ArtistOrderColumnType = Order;
