import {
  CommonResponseBase,
  PaginationResponseBase,
} from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import { DesignImageSet, SimpleDesignItem } from "@/types/DesignItem";
import { SimpleProductVariant } from "@/types/ProductVariant";

export const createDesignItemApi = (body: {
  variantId: string;
  name: string;
}) =>
  axiosClient.post<CommonResponseBase<SimpleDesignItem>>("/inventory-item", {
    ...body,
  });

export const updateImageCombinationApi = (
  designItemId: SimpleDesignItem["id"],
  combination: SimpleDesignItem["combinationCode"]
) => {
  //TODO: call api later
  //TODO: reset the image combination also
};

export const updateImageSetApi = (
  designItemId: SimpleDesignItem["id"],
  imageSets: DesignImageSet[]
) => {
  //TODO: call api later
};

export const updateGeneralInformation = (
  designItemId: SimpleDesignItem["id"],
  generalInfo: object
) => {
  //TODO: call api later
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
