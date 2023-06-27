import { User } from "./User";

export type Tag = {
  name: string;
  description: string;
  color: string;
};

export type OwnerInfo = User & {
  rating: number;
};

export type Product = {
  id: string;
  name: string;
  price: Price;
  description: string;
  tags: string[];
  ownerInfo: OwnerInfo;
  ratings: number;
  attaches: Attaches[];
  status: "DELETE" | "AVAILABLE" | "SOLD_OUT" | "HIDDEN";
  type: "NORMAL" | "PRE_ORDER";
  remainingQuantity: number;
  publishDatetime: string; // ISO String
  preOrderRange?: string[]; // ISO String[]
  maxItemsPerOrder: number;
  allowDelivery: boolean;
  paymentMethods: PaymentMethod[];
  category: Category;
  thumbnailUrl: string; // URL
};

export type ArtistProductColumnType = Pick<
  Product,
  "name" | "publishDatetime" | "maxItemsPerOrder" | "status" | "thumbnailUrl"
>;

export type Attaches = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  title: string;
  description?: string;
};

export type PaymentMethod = {
  id: string;
  type: string;
};

export type Price = {
  value: number;
  unit: string;
};

export type Category = {
  id: string;
  name: string;
};

export type CreateProductValues = {
  name: string;
  category: string | null;
  // memberOnly: boolean;
  tags: string[];
  description: string;
  price: Price;
  thumbnail: string;
  attaches: Attaches[];
  maxItemsPerOrder: number;
  remainingQuantity: number;
  // pre-order
  allowPreOrder: boolean;
  publishDatetime: Date | null;
  preOrderRange: (Date | null)[];
  // shipping
  allowShipping: boolean;
  pickupLocation: string;
  sameAsStoreAddress: boolean;
  // payment
  paymentMethods: string[];
};
