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
};

export type ADDRESS_TYPE_ENUM = keyof typeof ADDRESS_TYPE;

export type UserAddress = {
  address: string;
  id: string;
  isDefault: boolean;
  type: ADDRESS_TYPE_ENUM;
};
