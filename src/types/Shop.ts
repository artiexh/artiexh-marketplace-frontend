import { Ward } from "./User";

export type Shop = {
  id: string;
  shopName: string;
  shopImageUrl: string;
  shopAddress: string;
  shopWard: Ward;
  owner: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    status: string;
    avatarUrl: string;
    email: string;
    shopName: string;
  };
  shopPhone: string;
};
