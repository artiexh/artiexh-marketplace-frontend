import {
  ATTACHMENT_TYPE_ENUM,
  DELIVERY_TYPE_ENUM,
  PRODUCT_STATUS_ENUM,
  PRODUCT_TYPE_ENUM,
} from "@/constants/common";
import { User } from "./User";
import { Attaches } from "./common";
import { CampaignData } from "./Campaign";

export type Tag = {
  id: string;
  name: string;
};

export type OwnerInfo = Omit<
  User,
  "role" | "email" | "subscriptionsTo" | "avatarUrl" | "status"
> & {
  rating: number;
};

export type ShopInfo = {
  id: string;
  shopName: string;
  owner: {
    displayName: string;
    id: string;
    role: string;
    shopName: string;
    status: string;
    username: string;
  };
  shopImageUrl: string;
};

export type Product = {
  id: string;
  name: string;
  price: Price;
  description: string;
  tags: string[];
  owner: OwnerInfo;
  averageRate: number;
  attaches: Attaches[];
  status: "DELETE" | "AVAILABLE" | "SOLD_OUT" | "HIDDEN";
  type: "NORMAL" | "PRE_ORDER";
  quantity: number;
  publishDatetime: string; // ISO String
  preOrderRange?: string[]; // ISO String[]
  maxItemsPerOrder: number;
  allowDelivery: boolean;
  paymentMethods: PaymentMethod[];
  category: Category;
  thumbnailUrl: string; // URL
  shop: ShopInfo;
  campaign: CampaignData;
  weight: number;
};

export type ProductInventory = Omit<Product, "id"> & {
  productCode: string;
};

export type ArtistProductColumnType = Pick<
  Product,
  "name" | "publishDatetime" | "maxItemsPerOrder" | "status" | "thumbnailUrl"
>;

export type PaymentMethod = {
  id: string;
  type: string;
};

export type Price = {
  amount: number;
  unit: string;
};

export type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

export type CreateProductValues = {
  status: PRODUCT_STATUS_ENUM;
  name: string;
  price: Price;
  categoryId: string;
  description: string;
  type: PRODUCT_TYPE_ENUM;
  remainingQuantity: number;
  publishDatetime: Date;
  maxItemsPerOrder: number;
  deliveryType: DELIVERY_TYPE_ENUM;
  paymentMethods: string[];
  tags?: string[];
  attaches: File[];
  thumbnail?: File;
  weight: number;
  allowShipping?: boolean;
};

export type CreateProductBodyValues = Omit<
  CreateProductValues,
  "attaches" | "thumbnail"
> & {
  attaches: Omit<Attaches, "id">[];
};
