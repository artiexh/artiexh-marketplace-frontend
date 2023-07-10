import { Price } from "./Product";

export type Order = {
  id: string;
  thumb: string;
  name: string;
  total: Price;
  payment: string;
  status: string;
};

export type ArtistOrderColumnType = Pick<
  Order,
  "id" | "name" | "payment" | "status" | "thumb" | "total"
>;
