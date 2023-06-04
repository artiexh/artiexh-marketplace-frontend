import { Price } from "@/types/Product";

export const currencyFormatter = (countryCode: string, value: Price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value.value);
