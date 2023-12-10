import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import {
  CustomDesignImageSet,
  CustomProductDesignInfo,
  CustomProductGeneralInfo,
  SimpleCustomProduct,
} from "@/types/CustomProduct";
import { SimpleProductVariant } from "@/types/ProductVariant";
import { Attaches } from "@/types/common";

export const createCustomProductApi = (body: {
  variantId: string;
  name: string;
}) =>
  axiosClient.post<CommonResponseBase<SimpleCustomProduct>>(
    "/custom-product/general",
    {
      ...body,
    }
  );

export const updateImageCombinationApi = (
  designItem: CustomProductDesignInfo,
  combination: CustomProductDesignInfo["combinationCode"]
) => {
  return axiosClient.put<CommonResponseBase<CustomProductDesignInfo>>(
    `/custom-product/${designItem.id}/design`,
    {
      id: designItem.id,
      combinationCode: combination,
      imageSet: [],
      modelThumbnailId: designItem.modelThumbnail?.id,
      name: designItem.name,
      variantId: designItem.variant.id,
    }
  );
};

export const updateThumbnailApi = (
  designItem: CustomProductDesignInfo,
  thumbnailId: string
) => {
  //TODO: call api later
  return axiosClient.put<CommonResponseBase<CustomProductDesignInfo>>(
    `/custom-product/${designItem.id}/design`,
    {
      id: designItem.id,
      combinationCode: designItem.combinationCode,
      imageSet: designItem.imageSet.map((el) => ({
        positionCode: el.positionCode,
        mockupImageId: el.mockupImage?.id,
        manufacturingImageId: el.manufacturingImage?.id,
      })),
      variantId: designItem.variant.id,
      modelThumbnailId: thumbnailId,
      name: designItem.name,
    }
  );
};

export const updateImageSetApi = (
  designItem: CustomProductDesignInfo,
  imageSets: CustomDesignImageSet[],
  thumbnailId?: string
) => {
  //TODO: call api later
  return axiosClient.put<CommonResponseBase<CustomProductDesignInfo>>(
    `/custom-product/${designItem.id}/design`,
    {
      id: designItem.id,
      combinationCode: designItem.combinationCode,
      imageSet: imageSets.map((el) => ({
        positionCode: el.positionCode,
        mockupImageId: el.mockupImage?.id,
        manufacturingImageId: el.manufacturingImage?.id,
      })),
      variantId: designItem.variant.id,
      modelThumbnailId: thumbnailId,
      name: designItem.name,
    }
  );
};

export const updateGeneralInformationApi = (
  designItem: CustomProductGeneralInfo,
  generalInfo: {
    name: string;
    description?: string;
    tags?: string[];
    attaches?: Attaches[];
  }
) => {
  //TODO: call api later
  return axiosClient.put<CommonResponseBase<CustomProductGeneralInfo>>(
    `/custom-product/${designItem.id}/general`,
    {
      id: designItem.id,
      name: generalInfo.name,
      description: generalInfo.description,
      tags: generalInfo.tags ?? [],
      variantId: designItem.variant.id,
      attaches: generalInfo?.attaches ?? [],
    }
  );
};

//TODO: remove later
type ProviderConfigByDesignItem = {
  providerName: string;
  designItems: {
    id: string;
    name: string;
    config:
      | {
          basePriceAmount: number;
          businessCode: string;
          manufacturingTime: string;
          minQuantity: number;
        }
      | undefined;
  }[];
};

export const deleteDesignItemApi = (id: string) =>
  axiosClient.delete(`/inventory-item/${id}`);

export const deleteCustomProductApi = (id: string) =>
  axiosClient.delete(`/custom-product/${id}`);
