import axiosClient from "../axiosClient";

type CustomProductBody = {
  attaches: {
    description: string;
    title: string;
    type: string;
    url: string;
  }[];
  description: string;
  inventoryItemId: number;
  limitPerOrder: number;
  name: string;
  price: {
    amount: number;
    unit: string;
  };
  productCategoryId: number;
  quantity: number;
  tags: [string];
};

export const createCampaignApi = (body: {
  customProducts: CustomProductBody[];
  providerId: string;
}) =>
  axiosClient.post("/campaign", {
    ...body,
  });
