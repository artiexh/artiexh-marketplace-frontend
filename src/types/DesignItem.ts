import { SimpleProductBase } from "./ProductBase";

export type DesignImageSet = {
  manufacturingImage?: {
    fileName: string;
    id: string;
  };
  mockupImage?: {
    fileName: string;
    id: string;
  };
  positionCode: string;
};

export type CustomDesignImageSet = {
  manufacturingImage: {
    fileName: string;
    id: number;
    file?: string | File;
  };
  mockupImage: {
    fileName: string;
    id: number;
    file?: string | File;
  };
  positionCode: string;
};

export type SimpleDesignItem = {
  combinationCode: string;
  id: number;
  imageSet: Array<DesignImageSet>;
  name: string;
  description: string;
  tags: string[];
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
  thumbnail?: {
    fileName: string;
    id: string;
    name: string;
  };
};

export type DesignItemDetail = {
  combinationCode: string;
  id: number;
  imageSet: Array<DesignImageSet>;
  name: string;
  description: string;
  tags: string[];
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
  thumbnail?: {
    fileName: string;
    id: string;
    name: string;
  };
};
