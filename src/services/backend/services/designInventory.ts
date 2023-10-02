import { CommonResponseBase } from "@/types/ResponseBase";
import axiosClient from "../axiosClient";
import { DesignImageSet, SimpleDesignItem } from "@/types/DesignItem";

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
