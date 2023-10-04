import { SimpleDesignItem } from "@/types/DesignItem";

export const storeDesignItemsForCampaign = (
  designItems: SimpleDesignItem[],
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
): SimpleDesignItem[] => {
  const designItemsString = localStorage.getItem(
    `designItemsForCampaign.${campaignId}`
  );

  if (designItemsString) {
    return JSON.parse(designItemsString);
  }
  return [];
};
