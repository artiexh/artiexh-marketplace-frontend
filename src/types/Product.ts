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
  attaches: Attaches[];
  averageRate: number;
  category: {
    id: string;
    name: string;
  };
  deliveryType: "SHIP";
  description: string;
  maxItemsPerOrder: number;
  name: string;
  owner: {
    avatarUrl: string;
    displayName: string;
    id: string;
    province: {
      country: {
        id: 0;
        name: string;
      };
      id: 0;
      name: string;
    };
    username: string;
  };
  paymentMethods: ["VN_PAY"];
  price: {
    amount: number;
    unit: string;
  };
  productCode: string;
  quantity: number;
  saleCampaign: {
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
    thumbnailUrl: string;
    to: string;
    type: "SHARE" | "PUBLIC" | "PRIVATE";
  };
  status: string;
  tags: string[];
  thumbnailUrl: string;
  type: "NORMAL";
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
