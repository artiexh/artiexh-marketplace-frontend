import { Price } from "@/types/Product";

export const priceToString = (price: Price) =>
  `${new Intl.NumberFormat().format(price?.amount)} ${price?.unit}`;
