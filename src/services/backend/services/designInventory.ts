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
          minQuantity: 1;
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

  console.log("🚀 ~ file: designInventory.ts:62 ~ res:", res);
  if (res.data.totalSize === 0)
    return {
      path: "string",
      timestamp: 1,
      status: 200,
      data: {
        items: [],
        page: 0,
        pageSize: 10,
        totalPage: 1,
        totalSize: 0,
      },
    };

  const firstElement = res.data.items[0];

  const mapper: ProviderConfigByDesignItem[] = firstElement.providerConfigs.map(
    (provider) => {
      return {
        providerName: provider.businessCode,
        designItems: res.data.items
          .filter((el) =>
            designItems
              .map((i) => i.variantId.toString())
              .includes(el.id.toString())
          )
          .filter(
            (el) =>
              el.providerConfigs.find(
                (c) => c.businessCode === provider.businessCode
              ) !== null
          )
          .map((c) => {
            return {
              id: c.id.toString(),
              name: designItems.find(
                (i) => i.variantId.toString() === c.id.toString()
              )!.name,
              config: c.providerConfigs.find(
                (c) => c.businessCode === provider.businessCode
              ),
            };
          }),
      };
    }
  );
  console.log("🚀 ~ file: designInventory.ts:115 ~ mapper:", mapper);

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
