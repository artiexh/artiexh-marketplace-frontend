import { CartItem } from "@/services/backend/types/Cart";

export type SelectedItems = {
  artistId: string;
  items: CartItem[];
};
