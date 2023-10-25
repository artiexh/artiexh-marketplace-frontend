import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import {
  DesignImageSet,
  DesignItemDetail,
  SimpleDesignItem,
} from "@/types/DesignItem";
import { SimpleProductVariant } from "@/types/ProductVariant";

export const createDesignItemApi = (body: {
  variantId: string;
  name: string;
}) =>
  axiosClient.post<CommonResponseBase<SimpleDesignItem>>("/inventory-item", {
    ...body,
  });

export const updateImageCombinationApi = (
  designItem: DesignItemDetail,
  combination: SimpleDesignItem["combinationCode"]
) => {
  return axiosClient.post<CommonResponseBase<DesignItemDetail>>(
    "/inventory-item",
    {
      id: designItem.id,
      combinationCode: combination,
      imageSet: [],
      name: designItem.name,
      description: designItem.description,
      tags: designItem.tags,
      variantId: designItem.variant.id,
    }
  );
};

export const updateThumbnailApi = (
  designItem: DesignItemDetail,
  thumbnailId: string
) => {
  //TODO: call api later
  return axiosClient.post<CommonResponseBase<DesignItemDetail>>(
    "/inventory-item",
    {
      id: designItem.id,
      combinationCode: designItem.combinationCode,
      imageSet: designItem.imageSet.map((el) => ({
        positionCode: el.positionCode,
        mockupImageId: el.mockupImage?.id,
        manufacturingImageId: el.manufacturingImage?.id,
      })),
      name: designItem.name,
      description: designItem.description,
      tags: designItem.tags ?? [],
      variantId: designItem.variant.id,
      thumbnailId: thumbnailId,
    }
  );
};

export const updateImageSetApi = (
  designItem: DesignItemDetail,
  imageSets: DesignImageSet[],
  thumbnailId?: string
) => {
  //TODO: call api later
  return axiosClient.post<CommonResponseBase<DesignItemDetail>>(
    "/inventory-item",
    {
      id: designItem.id,
      combinationCode: designItem.combinationCode,
      imageSet: imageSets.map((el) => ({
        positionCode: el.positionCode,
        mockupImageId: el.mockupImage?.id,
        manufacturingImageId: el.manufacturingImage?.id,
      })),
      name: designItem.name,
      description: designItem.description,
      tags: designItem.tags,
      variantId: designItem.variant.id,
      thumbnailId: thumbnailId,
    }
  );
};

export const updateGeneralInformationApi = (
  designItem: DesignItemDetail,
  generalInfo: {
    name: string;
    description?: string;
    tags?: string[];
  }
) => {
  //TODO: call api later
  return axiosClient.post<CommonResponseBase<DesignItemDetail>>(
    "/inventory-item",
    {
      id: designItem.id,
      combinationCode: designItem.combinationCode,
      imageSet: designItem.imageSet.map((el) => ({
        positionCode: el.positionCode,
        mockupImageId: el.mockupImage?.id,
        manufacturingImageId: el.manufacturingImage?.id,
      })),
      name: generalInfo.name,
      description: generalInfo.description,
      tags: generalInfo.tags ?? [],
      variantId: designItem.variant.id,
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

export const calculateDesignItemProviderConfigApi = async (
  designItems: SimpleDesignItem[]
): Promise<
  CommonResponseBase<PaginationResponseBase<ProviderConfigByDesignItem>>
> => {
  const { data: res } = await axiosClient.get<
    CommonResponseBase<PaginationResponseBase<SimpleProductVariant>>
  >("/product-variant", {
    params: {
      pageSize: 100,
      productBaseId: 1,
    },
  });

  const mapper: ProviderConfigByDesignItem[] = [
    {
      providerName: " Provider 1",
      designItems: designItems.map((item) => ({
        name: item.name,
        id: item.id.toString(),
        config: {
          basePriceAmount: 1000000,
          businessCode: item.combinationCode,
          manufacturingTime: "6 days",
          minQuantity: 10,
        },
      })),
    },
    {
      providerName: " Provider 2",
      designItems: designItems.map((item) => ({
        name: item.name,
        id: item.id.toString(),
        config: {
          basePriceAmount: 2000000,
          businessCode: item.combinationCode,
          manufacturingTime: "8 days",
          minQuantity: 100,
        },
      })),
    },
  ];

  return {
    path: "string",
    timestamp: 1,
    status: 200,
    data: {
      items: mapper,
      page: 0,
      pageSize: 10,
      totalPage: 1,
      totalSize: 0,
    },
  };
};

export const deleteDesignItemApi = (id: string) =>
  axiosClient.delete(`/inventory-item/${id}`);
