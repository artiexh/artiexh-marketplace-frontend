import { Price } from "./Product";

export type Campaign = {
  id: string;
  thumb: string;
  name: string;
  total: Price;
  payment?: string;
  status: string;
};

export type ArtistCampaignColumnType = Pick<
  Campaign,
  "id" | "name" | "payment" | "status" | "thumb" | "total"
>;

export type CampaignData = {
  id: string;
  status: string;
  thumbnailUrl: string;
  owner: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  name: string;
  description: string;
  type: string;
  isPublished: boolean;
};
