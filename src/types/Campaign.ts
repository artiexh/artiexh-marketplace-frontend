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
