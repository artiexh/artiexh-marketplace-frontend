import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { CampaignData } from "@/types/Campaign";
import { getCampaignType } from "@/utils/mapper";
import clsx from "clsx";

export default function CampaignBanner({
  campaign,
}: {
  campaign: CampaignData;
}) {
  const type = getCampaignType(campaign);

  const campaignTypeData = CAMPAIGN_TYPE_DATA[type];

  return (
    <div
      className={clsx("campaign-banner flex", `bg-[${campaignTypeData.bgImg}]`)}
    >
      <div className="min-w-[200px]">{campaign.name}</div>
      <div>
        <div>{campaignTypeData.title}</div>
      </div>
    </div>
  );
}
