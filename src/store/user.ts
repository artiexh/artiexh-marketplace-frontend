// store/users.ts
import { Shop } from "@/types/Shop";
import { User } from "@/types/User";
import { atom } from "nanostores";

export const $user = atom<User | undefined>();
export const $shop = atom<Shop | undefined>();

export function setUser(user: User | undefined) {
  $user.set(user);
}

export function setShop(shop: Shop | undefined) {
  $shop.set(shop);
}
