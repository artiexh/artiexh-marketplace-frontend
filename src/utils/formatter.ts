import { Price } from "@/types/Product";

export const currencyFormatter = (countryCode: string, value: Price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value.amount);

export const urlFormatter = (baseUrl: string, values: Object) => {
  let url = baseUrl;
  const entries = Object.entries(values);

  for (let index = 0; index < entries.length; index++) {
    // Ignore undefined
    if (typeof entries[index][1] === "undefined") continue;
    // Ignore empty string
    if (typeof entries[index][1] === "string" && !entries[index][1]) continue;
    // Ignore empty array
    if (Array.isArray(entries[index][1]) && entries[index][1].length === 0)
      continue;
    // If array then join them using ,
    const [key, value] = Array.isArray(entries[index][1])
      ? [entries[index][0], entries[index][1].join(",")]
      : entries[index];
    // Format the url
    url += `${index === 0 ? "?" : "&"}${key}=${encodeURIComponent(value)}`;
  }
  return url;
};

export const getQueryString = (
  params: { [key: string]: any },
  excludeFields: string[]
) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] != null && !excludeFields.includes(key)) {
      searchParams.append(key, params[key]);
    }
  });

  return searchParams.toString();
};
