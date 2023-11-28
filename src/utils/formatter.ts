import { Ward } from "@/types/User";

export const currencyFormatter = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

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

export const getReadableWardAddress = (address: Ward | undefined) => {
  return `${address?.fullName}, ${address?.district.fullName}, ${address?.district.province.fullName}`;
};

export const productInSaleIdFormatter = (
  campaignId: string,
  productCode: string
) => `${campaignId}_${productCode}`;

export const destructProductInSaleId = (id: string) => {
  const [saleCampaignId, productCode] = id.split("_");
  return {
    saleCampaignId,
    productCode,
  };
};

export const dateFormatter = (date: string, fallback = "N/A") =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false, // Use 24-hour format
      }).format(new Date(date))
    : fallback;
