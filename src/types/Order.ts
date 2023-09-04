import { ORDER_STATUS_ENUM, PAYMENT_METHOD_ENUM } from "@/constants/common";
import { UserAddress } from "./User";

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
  deliveryType: string;
  quantity: number;
};

export type Order = {
  createdDate: string;
  id: string;
  modifiedDate: string;
  note: string;
  paymentMethod: PAYMENT_METHOD_ENUM;
  shippingAddress: UserAddress;
  orderDetails: OrderItemDetail[];
  shop: {
    id: string;
    shopImageUrl: string;
    shopName: string;
  };
  currentTransaction: OrderTransaction;
  status: ORDER_STATUS_ENUM;
};

export type ArtistOrder = {};

export type ArtistOrderColumnType = Order;
