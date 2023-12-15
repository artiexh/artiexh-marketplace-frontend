/* eslint-disable @next/next/no-img-element */
import { CAMPAIGN_TYPE_DATA } from "@/constants/campaign";
import { CampaignData } from "@/types/Campaign";
import { getCampaignTime } from "@/utils/date";
import { getCampaignType } from "@/utils/mapper";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
import Timer from "../Timer/Timer";
import styles from "./CampaignPreviewCard.module.scss";

export default function CampaignPreviewCard({
  campaign,
  contentStyle,
}: {
  campaign: CampaignData;
  contentStyle?: string;
}) {
  const router = useRouter();
  const [campaignType, setCampaignType] = useState<
    keyof typeof CAMPAIGN_TYPE_DATA
  >(getCampaignType(campaign));

  const campaignTime = getCampaignTime(
    campaign.from,
    campaign.to,
    getCampaignType(campaign)
  );
  const campaignTypeData = CAMPAIGN_TYPE_DATA[campaignType];

  return (
    <div
      className={clsx(styles["campaign-preview-card"], "cursor-pointer")}
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <div
        className={clsx(
          "content relative border-[6px] rounded-lg",
          campaignTypeData.borderStyle
        )}
      >
        <div
          className={clsx(
            "absolute left-0 top-0 z-10 pl-2 pr-4 pb-2 rounded-br-lg font-semibold",
            campaignTypeData.textStyle
          )}
        >
          {campaignTypeData.title}{" "}
          {campaign.type === "PRIVATE"
            ? `- Chỉ có ở Shop`
            : campaign.type === "PUBLIC"
            ? "- Chỉ có ở Arty"
            : undefined}
        </div>
        <ImageWithFallback
          src={campaign.thumbnailUrl}
          // src="https://images.augustman.com/wp-content/uploads/sites/2/2023/04/26131013/dragon-bll.jpeg"
          alt="dogtor"
          className="!w-full object-cover !h-[250px] !md:h-[300px] brightness-75"
          width={200}
          height={200}
        />
        <div
          className={clsx("absolute w-full px-2 py-2 bottom-0", contentStyle)}
        >
          <div className="flex items-center ">
            <div className="flex-1 pt-3 text-white pl-3">
              <div className="font-bold two-line">{campaign.name}</div>
              <div className="text-xs two-line">
                Từ: {new Date(campaign.from).toLocaleDateString()} đến{" "}
                {new Date(campaign.to).toLocaleDateString()}
              </div>
            </div>
            {campaignTime && (
              <div className="pt-3 py-4 px-3">
                <div className="text-white text-center">Chỉ còn:</div>
                <Timer
                  key={campaignType}
                  initValue={campaignTime}
                  onCompleted={() => setCampaignType(getCampaignType(campaign))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
