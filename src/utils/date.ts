import { CAMPAIGN_TYPE } from "@/constants/campaign";

export const timeValueSplit = (timeValue: number) => {
  let tempValue = timeValue;
  const day = Math.floor(tempValue / (24 * 60 * 60 * 1000));
  tempValue -= day * 24 * 60 * 60 * 1000;
  const hour = Math.floor(tempValue / (60 * 60 * 1000));
  tempValue -= hour * 60 * 60 * 1000;
  const minute = Math.floor(tempValue / (60 * 1000));
  tempValue -= minute * 60 * 1000;
  const second = Math.floor(tempValue / 1000);

  return [day, hour, minute, second];
};

export const getCampaignTime = (
  fromTimeString: string,
  toTimeString: string,
  campaignType: CAMPAIGN_TYPE
) => {
  if (campaignType === "IN_COMING") {
    return new Date(fromTimeString).getTime() - new Date().getTime();
  } else if (campaignType === "IN_GOING") {
    return new Date(toTimeString).getTime() - new Date().getTime();
  }
};

export const getDateRange = (startDate: Date, endDate: Date) => {
  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
};
