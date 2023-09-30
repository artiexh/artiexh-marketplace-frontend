import { SimpleProductBase } from "./ProductBase";

export type DesignImageSet = {
  manufacturingImage: {
    fileName: string;
    id: number;
  };
  mockupImage: {
    fileName: string;
    id: number;
  };
  positionCode: string;
};

export type SimpleDesignItem = {
  combinationCode: string;
  id: number;
  imageSet: Array<DesignImageSet>;
  name: string;
  variant: {
    id: number;
    productBase: SimpleProductBase;
    providerConfigs: {
      basePriceAmount: number;
      businessCode: string;
      manufacturingTime: string;
      minQuantity: number;
    }[];
    variantCombinations: {
      optionId: number;
      optionValueId: number;
      variantId: number;
    }[];
  };
  variantId: number;
};

export type DesignItemDetail = {};
