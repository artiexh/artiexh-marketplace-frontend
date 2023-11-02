import { SimpleCustomProduct } from "@/types/CustomProduct";

export const storeDesignItemsForCampaign = (
  designItems: SimpleCustomProduct[],
  campaignId: string
) => {
  const designItemsString = JSON.stringify(designItems);
  localStorage.setItem(
    `designItemsForCampaign.${campaignId}`,
    designItemsString
  );
};

export const getDesignItemsForCampaign = (
  campaignId: string
): SimpleCustomProduct[] => {
  const designItemsString = localStorage.getItem(
    `designItemsForCampaign.${campaignId}`
  );

  if (designItemsString) {
    return JSON.parse(designItemsString);
  }
  return [];
};
