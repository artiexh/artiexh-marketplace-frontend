import { Price } from "@/types/Product";
import { Ward } from "@/types/User";

export const currencyFormatter = (countryCode: string, value: Price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value.amount);

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
