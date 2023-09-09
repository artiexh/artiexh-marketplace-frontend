import { ADDRESS_TYPE } from "@/constants/common";
export type User = {
  id: number;
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
  shopAddress: string;
  shopImageUrl: string;
  shopName: string;
  shopPhone: string;
  shopWardId: string;
};
