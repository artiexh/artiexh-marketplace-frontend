// store/users.ts
import { User } from "@/types/User";
import { atom } from "nanostores";

export const $user = atom<User | undefined>();

export function setUser(user: User | undefined) {
  $user.set(user);
}
