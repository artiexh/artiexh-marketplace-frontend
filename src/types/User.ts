import { ADDRESS_TYPE } from "@/constants/common";
import { Category } from "./Product";
export type User = {
  id: string;
  username: string;
  status: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
  subscriptionsTo?: object[];
  email?: string;
  province: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
    };
  };
  subscriptionsFrom?: object[];
  shopName?: string;
  cartItemCount: number;
  shopThumbnailUrl?: string;
  description?: string;
};

export type ADDRESS_TYPE_ENUM = keyof typeof ADDRESS_TYPE;

export type Address = {
  address: string;
  id: string;
  isDefault: boolean;
  type: ADDRESS_TYPE_ENUM;
  phone: string;
  receiverName: string;
  ward: {
    id: string;
    name: string;
    fullName: string;
    district: {
      id: string;
      name: string;
      fullName: string;
      province: {
        id: string;
        name: string;
        fullName: string;
        country: {
          id: string;
          name: string;
        };
      };
    };
  };
};

export type CreateUserAddress = Omit<Address, "id" | "ward"> & {
  wardId: string;
};

export type Province = {
  id: string;
  name: string;
  fullName: string;
  country: {
    id: string;
    name: string;
  };
};

export type District = {
  id: string;
  name: string;
  fullName: string;
  province: Province;
};

export type Ward = {
  id: string;
  name: string;
  fullName: string;
  district: District;
};

export type ArtistRegisterData = {
  bankAccount: string;
  bankAccountName: string;
  bankName: string;
  description: string;
  phone: string;
  shopThumbnailUrl: string;
};

export type Provider = {
  businessCode: string;
  businessName: string;
  address: string;
  contactName: string;
  email: string;
  phone: string;
  imageUrl: string;
  categories: Category[];
};

export type Artist = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  numberOfSubscription: number;
  phone: string;
  bankAccount: string;
  bankName: string;
  shopThumbnailUrl?: string;
  description: string;
};
