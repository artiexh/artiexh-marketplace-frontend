import { SimpleProductBase } from "./ProductBase";
import { Attaches } from "./common";

export type CustomDesignImageSet = {
  manufacturingImage: {
    fileName: string;
    id: string;
    file?: string | File;
    name?: string;
  };
  mockupImage: {
    fileName: string;
    id: string;
    file?: string | File;
    name?: string;
  };
  positionCode: string;
};

export type SimpleCustomProduct = {
  campaignLock: string;
  category: {
    id: string;
    imageUrl: string;
    name: string;
  };
  createdDate: string;
  id: string;
  modelThumbnail: {
    fileName: string;
    id: string;
    name: string;
  };
  modifiedDate: string;
  name: string;
  tags: string[];
  variant: {
    id: string;
    productTemplate: {
      id: string;
      name: string;
    };
    variantCombinations: [
      {
        option: {
          id: string;
          name: string;
        };
        optionValue: {
          id: string;
          name: string;
          value: string;
        };
      }
    ];
  };
};

export type CustomProductDesignInfo = {
  campaignLock: string;
  category: {
    id: string;
    imageUrl: string;
    name: string;
  };
  combinationCode: string;
  createdDate: string;
  id: string;
  imageSet: CustomDesignImageSet[];
  modelThumbnail: {
    fileName: string;
    id: string;
    name: string;
  };
  modifiedDate: string;
  name: string;
  tags: string[];
  variant: {
    id: string;
    productTemplate: {
      id: string;
      name: string;
    };
    variantCombinations: [
      {
        option: {
          id: string;
          name: string;
        };
        optionValue: {
          id: string;
          name: string;
          value: string;
        };
      }
    ];
  };
};

export type CustomProductGeneralInfo = {
  attaches: Attaches[];
  campaignLock: string;
  category: {
    id: string;
    imageUrl: string;
    name: string;
  };
  createdDate: string;
  description: string;
  id: string;
  maxItemPerOrder: 0;
  modelThumbnail: {
    fileName: string;
    id: string;
    name: string;
  };
  modifiedDate: string;
  name: string;
  tags: string[];
  variant: {
    id: string;
    productTemplate: {
      id: string;
      name: string;
    };
    variantCombinations: [
      {
        option: {
          id: string;
          name: string;
        };
        optionValue: {
          id: string;
          name: string;
          value: string;
        };
      }
    ];
  };
};
