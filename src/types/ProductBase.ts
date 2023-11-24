import { Attaches } from "./common";

export type ProductBaseCategory = {
  id: string;
  imageUrl: string;
  name: string;
};

export type ImageCombination = {
  code: string;
  images: ImageConfig[];
  name: string;
};

export type ImageConfig = {
  code: string;
  name: string;
  position: [number, number, number];
  rotate: [number, number, number];
  scale: [number, number, number];
  size: {
    height: number;
    width: number;
  };
  mockupImageSize: {
    height: number;
    width: number;
  };
};

export type ProductVariantOption = {
  id: number;
  index: number;
  isOptional: true;
  name: string;
  optionValues: ProductVariantOptionValue[];
  productId: number;
};

export type ProductVariantOptionValue = {
  id: number;
  name: string;
  optionId: number;
  value: string;
};

export type SimpleProductBase = {
  attaches: Array<Attaches>;
  businessCodes: string[];
  category: ProductBaseCategory;
  categoryId: number;
  id: number;
  imageCombinations: [
    {
      code: string;
      images: ImageConfig[];
      name: string;
    }
  ];
  model3DCode: string;
  modelFileId: number;
  name: string;
  productOptions: ProductVariantOption[];
  sizeDescriptionUrl?: string;
  sizes: {
    key: string;
    label: string;
    number: number;
    unit: string;
  }[];
};

type Provider = {
  address: string;
  businessCode: string;
  businessName: string;
  category: {
    id: string;
    imageUrl: string;
    name: string;
  };
  categoryId: number;
  contactName: string;
  description: string;
  email: string;
  imageUrl: string;
  phone: string;
  website: string;
};

export type ProductBaseDetail = {
  attaches: Array<Attaches>;
  businessCodes: string[];
  category: ProductBaseCategory;
  categoryId: number;
  description: string;
  id: number;
  imageCombinations: Array<ImageCombination>;
  model3DCode: string;
  modelFileId: number;
  name: string;
  productOptions: ProductVariantOption[];
  providers: Array<Provider>;
  sizeDescriptionUrl: string;
  sizes: {
    key: string;
    label: string;
    number: number;
    unit: string;
  }[];
};
