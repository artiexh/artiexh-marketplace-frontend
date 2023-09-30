import { SimpleProductBase } from "./ProductBase";

export type SimpleProductVariant = {
  id: number;
  productBase: SimpleProductBase;
  providerConfigs: {
    basePriceAmount: number;
    businessCode: string;
    manufacturingTime: string;
    minQuantity: 1;
  }[];
  variantCombinations: {
    optionId: number;
    optionValueId: number;
    variantId: number;
  }[];
};
